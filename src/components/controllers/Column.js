import React from 'react';
import ColumnView from '../views/ColumnView'
import { TaskService } from '../../services/TaskService';

class Column extends React.Component {
    constructor(props) {
        super(props)
        this.columnReference = this.props.columnReference; //dodac jako props referencje do bazy danych, podobnie jak w Home do Project
        this.taskService = new TaskService();
        this.state = {
            tasks: []
        }
    }

    componentDidMount() {
        this.setDatabaseListener();
    }

    handleSubmit = data => {
        const estimatedTime = data.estimatedTime;
        const loggedTime = data.loggedTime;
        const name = data.name;
        const order = data.order;
        this.taskService.addTask(estimatedTime, loggedTime, name, order, this.columnReference);
    }

    handleEdit = data => {
        const name = data.name;
        const newTaskObject = data.newTaskObject;
        this.taskService.editTask(name, newTaskObject, this, this.columnReference);
    }

    handleDelete = data => {
        const name = data.name;
        this.taskService.deleteTask(name, this.columnReference);
    }

    render() {
        return (
            <div>
                <div className="name">Zakładka <u>{this.props.name}</u></div>
                <ColumnView
                    tasks={this.state.tasks}
                    handleSubmit={this.handleSubmit}
                    handleEdit={this.handleEdit}
                    handleDelete={this.handleDelete}
                />
            </div>
        )
    }

    setDatabaseListener() {
        this.taskService.tasksRef(this.columnReference).onSnapshot(data => {
            const listOfFetchedTasks = [];
            data.docs.forEach(doc => {
                const taskReference = doc.ref;
                const data = doc.data();
                data['ref'] = taskReference;
                listOfFetchedTasks.push(data);
                console.log('fetched task', data);
            });
            this.setState({
                tasks: listOfFetchedTasks
            });
        });
    }
}

export default Column;
