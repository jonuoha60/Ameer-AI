package firebase

import (
	"context"

	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

func InitFirebase(credentialsPath string) (*firebase.App, error) {
	opt := option.WithCredentialsFile(credentialsPath)

	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return nil, err
	}

	return app, nil
}