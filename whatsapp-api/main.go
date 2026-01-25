package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/mdp/qrterminal/v3"
	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/store/sqlstore"
	"go.mau.fi/whatsmeow/types/events"
	waLog "go.mau.fi/whatsmeow/util/log"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	ctx := context.Background()

	logger := waLog.Stdout("Main", "INFO", true)

	container, err := sqlstore.New(
		ctx,
		"sqlite3",
		"file:whatsapp.db?_foreign_keys=on",
		logger,
	)
	if err != nil {
		log.Fatal(err)
	}

	deviceStore, err := container.GetFirstDevice(ctx)
	if err != nil {
		log.Fatal(err)
	}

	client := whatsmeow.NewClient(deviceStore, logger)

	client.AddEventHandler(func(evt interface{}) {
		switch v := evt.(type) {
		case *events.Message:
			if v.Message.GetConversation() != "" {
				fmt.Println("Received:", v.Message.GetConversation())
			}
		}
	})

	if client.Store.ID == nil {
		qrChan, _ := client.GetQRChannel(ctx)
		err = client.Connect()
		if err != nil {
			log.Fatal(err)
		}

		for evt := range qrChan {
			if evt.Event == "code" {
				fmt.Println("Scan this QR in WhatsApp:", evt.Code)
				fmt.Println("Scan this QR in WhatsApp:")
qrterminal.GenerateHalfBlock(evt.Code, qrterminal.L, os.Stdout)

			}
		}
	} else {
		err = client.Connect()
		if err != nil {
			log.Fatal(err)
		}
	}

	select {}
}

