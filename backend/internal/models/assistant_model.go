package models

type Assistant struct {
	Message string `json:"message"`
}

type AssistantResult struct {
	Response string `json:"response"`
}
