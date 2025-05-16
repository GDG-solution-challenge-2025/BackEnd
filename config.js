const config = {
    port: 10000, //Port to be used for the service
    serverIP: 'https://0.0.0.0', //IP address for the service (include the protocol)
    dbIp: '0.0.0.0', //MySQL IP address to connect to
    dbPort: '10000', //MySQL Port to connect to
    dbId: 'username', //MySQL username for login
    dbPw: 'password', //MySQL password for login
    dbSchema: 'schema', //Default MySQL schema
    session: 1, //Session timeout duration (in hours)
    filePath: 'C:/file', //Path to store images (absolute path)
    pythonPath: 'C:/python.exe', //Python executable path (absolute path)
    foodAI: 'C:/food_main_dummy.py', //Installation path for the food_main_gemini module (absolute path)
    ocrAI: 'C:/menu_img_input_gemini.py', //Installation path for the menu_img_input_gemini module (absolute path)
    textAI: 'C:/menu_food_input_gemini.py', //Installation path for the menu_food_input_gemini module (absolute path)
    gcpKey: '' //Google Maps API key
}

export default config