const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const app = express();

app.use(express.json());

const jsonPath = path.resolve('./file/tasks.json')

app.get('/tasks', async (req, res) => {
    //obtener el json
    const jsonFile = await fs.readFile(jsonPath, 'utf8');

    //enviar la respuesta
    res.send(jsonFile);

});

//creacion de una Tasks tareas dentro de un json
app.post('/tasks', async (req, res) => {
    //nos envian la informacion dentro del body de  la peticion
    const task = req.body;
    //obtener el arreglo desde el json file
    const taksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));

    //generar un nuevo id - tomar el tamano del arreglo ultima tarea
    const lastIndex = taksArray.length - 1;
    const newId = taksArray[lastIndex].id + 1;

    //agregar la tarea a el arreglo

    taksArray.push({ ...task, id: newId });
    //escribir la informacion en el json
    await fs.writeFile(jsonPath, JSON.stringify(taksArray));
    console.log(taksArray);
    res.end('Tarea agregada');
});

//Actualizacion de una tarea
// Se actualizara todo la informacion
// Title, description, status
//en el body enviaremos el id de la tarea que se va actualizar

app.put('/tasks', async (req, res) => {
    //obtener el arreglo desde el json file
    const taksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));

    const { title, description, status, id } = req.body;
    //Buscarel id de la tarea dentro del arreglo

    const taskIndex = taksArray.findIndex(taks => taks.id === id);

    if (taskIndex >= 0) {
        taksArray[taskIndex].title = title;
        taksArray[taskIndex].description = description;
        taksArray[taskIndex].status = status;

    }

    //escribir nuevamente el arreglo en el archivo
    await fs.writeFile(jsonPath, JSON.stringify(taksArray));
    console.log(taksArray);
    res.send('Tarea actualizada')

});

//Eliminar una tarea

app.delete('/tasks', async (req, res) => {
    //obtener el arreglo desde el json file
    const taksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    const {id} = req.body;
    
    //Encontrar la tarea que se quiere eliminar (id)
    const taskIndex = taksArray.findIndex(taks => taks.id === id);

    //se limina del arreglo
    taksArray.splice(taskIndex, 1);
    //se escribe en el json nuevamente 
    await fs.writeFile(jsonPath, JSON.stringify(taksArray));
    res.end('El usuario fue eliminado')
    
});

const PORT = 8500;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);

});