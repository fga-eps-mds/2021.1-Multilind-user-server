import express from 'express'; 

class Server { 
    constructor(){
        this.app = express(); 
        this.middlewares(); 
    }

    middlewares(){
        this.app.use('/', (req, res) => {
            res.send("server is up!!"); 
        })
    } 

    routes(){
        // call routes
    }
}

export default new Server().app; 