document.addEventListener('deviceready', start, false);

var db;
var todoId;
var name;
var begin;
var during;

function start()
{
    db = window.openDatabase("data", "1.0", "Cordova Demo", 200000);
    db.transaction(populateDB, errorCB, successCB);
    db.transaction(selectTodo, errorCB, generateTable);
}

function populateDB(tx)
{
    tx.executeSql('DROP TABLE IF EXISTS todo')
    tx.executeSql('CREATE TABLE IF NOT EXISTS todo (todo_id unique, todo_name, todo_begining, todo_during)');
    tx.executeSql('INSERT INTO todo (todo_id, todo_name, todo_begining, todo_during) VALUES (1, "knut", "3 septembre 1993", "25")');
    tx.executeSql('INSERT INTO todo (todo_id, todo_name, todo_begining, todo_during) VALUES (2, "benji", "11 septembre", "undefined + 25")');
}

function selectTodo(tx)
{
    tx.executeSql('SELECT * FROM todo', [], function(tx, result)
    {
        allTodo = result.rows;
        console.log(allTodo);
        return allTodo;
    })
}

function errorCB(err) {
    console.log(err);
}

function successCB() {
    console.log("success!");
}

function generateTable()
{
    $(".table").append("<tr>" + 
        "<th>Nom</th>" + 
        "<th>Date du début</th>" +
        "<th>Durée</th>" +
    "</tr>");
    for(var i = 0; i < allTodo.length; i++)
    {
        $(".table").append("<tr>" +
            "<td>" + allTodo[i].todo_name + "</td>" + 
            "<td>" + allTodo[i].todo_begining + "</td>" + 
            "<td>" + allTodo[i].todo_during + "</td>" +         
        "</tr>")
    }
}

function generateForm()
{
   $("#form").append("<input id='name' type='text' placeholder='Nom de la tâche'> <br>" + 
                    "<input id='begin' type='date' placeholder='Date de début'> <br>" +
                    "<input id='during' type='time' placeholder='Durée' <br>" + 
                    "<button id='validate'>Valider</button>");    
}

$("#add").on('click', function()
{
    $("#add").hide();
    $(".table").empty();
    generateForm();
});

$("#form").delegate('#validate', 'click', function()
{
    $("#add").show();
    name = $("#name").val();
    begin = $("#begin").val();
    during = $("#during").val();
    console.log(name);
    console.log(begin);
    console.log(during);
    $("#form").empty();
    
    db.transaction(searchAll, errorCB, successCB);
});

function searchAll(tx)
{
    tx.executeSql('SELECT * FROM todo;', [], function(tx, result){
        todo = result.rows;
        console.log(todo);
        for (i=0; i<todo.length; i++) {
            todoId = i+2;
        }        
        db.transaction(insertNewTodo, errorCB, successCB);
        console.log(todo);
        console.log(todoId);
    });
}

function insertNewTodo(tx)
{           
    var sql = 'INSERT INTO todo (todo_id, todo_name, todo_begining, todo_during) VALUES (' + todoId + ', "' + name + '", "' + begin + '", "' + during + '")';
    console.log(sql);
    tx.executeSql(sql);
    db.transaction(selectTodo, errorCB, generateTable);
}