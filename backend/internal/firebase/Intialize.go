package firebase

import (
	"context"
	"encoding/base64"
	"fmt"

	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

func InitFirebase(credentialsBase64 string) (*firebase.App, error) {
	credsJSON, err := base64.StdEncoding.DecodeString(credentialsBase64)
	if err != nil {
		return nil, err
	}

	fmt.Println(string(credsJSON[:200]))

	opt := option.WithCredentialsJSON(credsJSON)

	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return nil, err
	}

	return app, nil
}
