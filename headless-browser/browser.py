#!/usr/bin/env python3
"""Open and extract a Freelancer project using a persistent Selenium profile."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait


DEFAULT_URL = (
    "https://www.freelancer.com/projects/full-stack-development/"
    "Software-Project-Sourcing-Specialist"
)
APP_DIR = Path(__file__).resolve().parent
DEFAULT_PROFILE = APP_DIR / "browser-profile"


def make_driver(profile: Path, headless: bool = False) -> webdriver.Remote:
    profile.mkdir(parents=True, exist_ok=True)
    if shutil.which("google-chrome") or shutil.which("chromium"):
        options = webdriver.ChromeOptions()
        options.add_argument(f"--user-data-dir={profile.resolve()}")
        options.add_argument("--start-maximized")
        options.add_argument("--disable-notifications")
        options.add_argument("--lang=en-US")
        if headless:
            options.add_argument("--headless=new")
            options.add_argument("--window-size=1440,1200")
        return webdriver.Chrome(options=options)

    if shutil.which("firefox"):
        options = webdriver.FirefoxOptions()
        options.add_argument("-profile")
        options.add_argument(str(profile.resolve()))
        if headless:
            options.add_argument("-headless")
        return webdriver.Firefox(options=options)

    raise RuntimeError("Install Firefox, Google Chrome, or Chromium first")


def text_for(driver: webdriver.Remote, selectors: list[str]) -> str | None:
    for selector in selectors:
        for element in driver.find_elements(By.CSS_SELECTOR, selector):
            value = element.text.strip()
            if value:
                return value
    return None


def all_text_for(driver: webdriver.Remote, selectors: list[str]) -> list[str]:
    values: list[str] = []
    for selector in selectors:
        for element in driver.find_elements(By.CSS_SELECTOR, selector):
            value = element.text.strip()
            if value and value not in values:
                values.append(value)
        if values:
            break
    return values


def json_ld(driver: webdriver.Remote) -> list[Any]:
    results: list[Any] = []
    for element in driver.find_elements(By.CSS_SELECTOR, 'script[type="application/ld+json"]'):
        raw = element.get_attribute("textContent")
        if not raw:
            continue
        try:
            results.append(json.loads(raw))
        except json.JSONDecodeError:
            pass
    return results


def meta(driver: webdriver.Remote, name: str) -> str | None:
    scripts = "return document.querySelector(arguments[0])?.content || null"
    return driver.execute_script(scripts, name)


def extract(driver: webdriver.Remote, requested_url: str) -> dict[str, Any]:
    """Extract stable metadata and best-effort rendered project fields."""
    return {
        "requested_url": requested_url,
        "final_url": driver.current_url,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "title": text_for(driver, ["h1", "[data-testid='project-title']"])
        or meta(driver, "meta[property='og:title']")
        or driver.title,
        "description": text_for(
            driver,
            [
                "[data-testid='project-description']",
                ".ProjectDescription",
                "fl-project-view-project-details .NativeElement",
            ],
        )
        or meta(driver, "meta[property='og:description']")
        or meta(driver, "meta[name='description']"),
        "budget": text_for(
            driver,
            [
                "[data-testid='project-budget']",
                "fl-project-view-project-details h2",
                "[class*='Budget']",
            ],
        ),
        "skills": all_text_for(
            driver,
            [
                "[data-testid='project-skills'] a",
                "fl-project-view-project-details a[href*='/jobs/']",
                "a[href*='/jobs/']",
            ],
        ),
        "json_ld": json_ld(driver),
    }


def output_path_for(data: dict[str, Any]) -> Path:
    """Create a safe JSON filename from the fetched project's title."""
    title = str(data.get("title") or "freelancer-project")
    stem = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return APP_DIR / "project-data" / f"{stem or 'freelancer-project'}.json"


def wait_for_page(driver: webdriver.Remote, timeout: int) -> None:
    WebDriverWait(driver, timeout).until(
        lambda browser: browser.execute_script("return document.readyState") == "complete"
    )
    try:
        WebDriverWait(driver, timeout).until(
            lambda browser: browser.find_elements(By.CSS_SELECTOR, "h1")
            or browser.find_elements(By.CSS_SELECTOR, 'script[type="application/ld+json"]')
        )
    except TimeoutException:
        # Still return metadata/body diagnostics for login or challenge pages.
        pass


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Browse and extract a Freelancer project with a saved login session."
    )
    parser.add_argument(
        "command",
        choices=("login", "fetch", "browse"),
        nargs="?",
        default="browse",
        help="action to perform (default: browse)",
    )
    parser.add_argument("--url", default=DEFAULT_URL)
    parser.add_argument("--profile", type=Path, default=DEFAULT_PROFILE)
    parser.add_argument(
        "--output",
        type=Path,
        help="JSON output path (default: generated from the project title)",
    )
    parser.add_argument("--timeout", type=int, default=30)
    parser.add_argument("--headless", action="store_true", help="Only use after logging in")
    args = parser.parse_args()

    if args.command == "login" and args.headless:
        parser.error("login cannot be used with --headless")

    driver = make_driver(args.profile, args.headless)
    try:
        if args.command == "login":
            driver.get("https://www.freelancer.com/login")
            print("\nLog in in the opened browser window.")
            print("After login completes, return here and press Enter.")
            input()
            driver.get(args.url)
            wait_for_page(driver, args.timeout)
            print(f"Login/profile data saved in: {args.profile.resolve()}")
            return 0

        driver.get(args.url)
        wait_for_page(driver, args.timeout)
        data = extract(driver, args.url)
        output = args.output or output_path_for(data)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
        print(json.dumps(data, indent=2, ensure_ascii=False))
        print(f"\nSaved to: {output.resolve()}")

        if args.command == "browse" and not args.headless:
            print("Browser will remain open. Press Enter here to close it.")
            input()
        return 0
    except TimeoutException:
        print("Timed out while loading the page. Try a larger --timeout.", file=sys.stderr)
        return 2
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    finally:
        driver.quit()


if __name__ == "__main__":
    raise SystemExit(main())
