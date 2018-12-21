document.addEventListener('deviceready', start, false);

var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);

function start()
{
    db.transaction(populateDB, errorCB, successCB);
    db.transaction(selectTodo, errorCB, successCB);
}

function populateDB(tx)
{
    tx.executeSql('CREATE TABLE IF NOT EXISTS todo (todo_id unique, todo_name, todo_begining, todo_during)');
    tx.executeSql('INSERT INTO todo (todo_id, todo_name, todo_begining, todo_during) VALUES (1, "knut", "12", "56")');
}

function selectTodo(tx)
{
    tx.executeSql('SELECT * FROM todo', [], function(tx, result)
    {
        console.log(result.rows);
    })
}

function errorCB(err) {
    console.log(err);
}

function successCB() {
    console.log("success!");
}
