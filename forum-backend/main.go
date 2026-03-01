package main

import (
    "fmt"
    "forum/config"
)

func main() {
    config.ConnectDatabase()
    fmt.Println("Database migration finished")
}
