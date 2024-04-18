// Access userInfo and set the owner field
let userInfo = getCookie('user');
let userParsed = JSON.parse(userInfo);
$('#owner').val(userParsed._id);


//// CREATE NEW TASK
$('#taskForm').submit(function (event) {
    event.preventDefault(); // Prevent default form submission

    // Construct JSON object with form data
    const jsonData = {
        name: $('#name').val(),
        description: $('#description').val(),
        category: $('#category').val(),
        label: $('#label').val(),
        dueDate: $('#dueDate').val(),
        owner: $('#owner').val(),
        priority: $('#priority').val(),
        status: $("#status").val()
    };
    console.log(jsonData);

    // Send JSON data to the server using AJAX
    $.ajax({
        type: 'POST',
        url: '/tasks',
        contentType: 'application/json',
        data: JSON.stringify(jsonData),
        success: async function (response) {
            try {
                updateTasks($('#sortTasks').val(), getCurrentPageNumber());

                // Clear the form input fields
                $('#name').val('');
                $('#description').val('');
                $('#category').val('');
                $('#label').val('');
                $('#dueDate').val('');
                $('#priority').val(0);

                // Display success message
                $('#messages').text('Task created successfully!').addClass('success');

                


            } catch (error) {
                console.error('Error:', error);
                // Handle error here
                $("#messages").text("Error: an error occurred when creating a task.").addClass('error');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
            // Handle error here
            $("#messages").text("Error: ", error).addClass('error');
        }
    });

});



// UPDATE TASK
$(document).ready(function () {
    // Update button click event
    $('#tasks-container').on('click', '.updateButton', function () {
        const taskItem = $(this).closest('.task-item');
        const isEditing = taskItem.hasClass('editing');

        // Toggle between text view and update form
        if (!isEditing) {
            // Show task item
            // Hide delete and edit buttons
            taskItem.find('.deleteButton').hide();
            taskItem.find('.updateButton').hide();

            taskItem.addClass('editing');
            taskItem.find('.task-name').hide();
            taskItem.find('.task-description').hide();
            taskItem.find('.task-category').hide();
            taskItem.find('.task-label').hide();
            taskItem.find('.task-dueDate').hide();
            taskItem.find('.task-priority').hide();
            taskItem.find('.task-status').hide();

            taskItem.find('.updateForm').show(); // Show the update form
        } else {
            // Show delete and edit buttons
            taskItem.find('.deleteButton').show();
            taskItem.find('.updateButton').show();

            taskItem.removeClass('editing');
            taskItem.find('.task-name').show();
            taskItem.find('.task-description').show();
            taskItem.find('.task-category').show();
            taskItem.find('.task-label').show();
            taskItem.find('.task-dueDate').show();
            taskItem.find('.task-priority').show();
            taskItem.find('.task-status').show();

            taskItem.find('.updateForm').hide(); // Hide the update form
        }
    });

    // Confirm update button click event
    $('#tasks-container').on('click', '.confirmUpdateButton', function (e) {
        e.preventDefault();
        const taskItem = $(this).closest('.task-item');
        const taskId = taskItem.data('task-id');
        console.log(taskId);
        const updatedData = {
            name: taskItem.find('#updateName').val(),
            description: taskItem.find('#updateDescription').val(),
            category: taskItem.find('#updateCategory').val(),
            label: taskItem.find('#updateLabel').val(),
            dueDate: taskItem.find('#updateDueDate').val(),
            priority: taskItem.find('#updatePriority').val(),
            status: taskItem.find('#updateStatus').val()
        };
        console.log(updatedData);
        

        // Send AJAX request to update task
        $.ajax({
            type: 'PUT',
            url: '/tasks/' + taskId,
            contentType: 'application/json',
            data: JSON.stringify(updatedData),
            success: function (response) {
                // Update task data in the DOM
                console.log(response);
                taskItem.find('.task-name').text(response.name);
                taskItem.find('.task-description').text("Description: " + response.description);
                taskItem.find('.task-category').text("Category: " + response.category);
                taskItem.find('.task-label').text("Label: " + response.label);
                taskItem.find('.task-dueDate').text("Due Date: " + response.dueDate);
                taskItem.find('.task-priority').text("Priority: " + response.priority);
                taskItem.find('.task-status').text("Status: " + response.status);

                taskItem.find('.deleteButton').show();
                taskItem.find('.updateButton').show();

                taskItem.removeClass('editing');
                taskItem.find('.task-name').show();
                taskItem.find('.task-description').show();
                taskItem.find('.task-category').show();
                taskItem.find('.task-label').show();
                taskItem.find('.task-dueDate').show();
                taskItem.find('.task-priority').show();
                taskItem.find('.task-status').show();

                taskItem.find('.updateForm').hide(); // Hide the update form
                updateTasks($('#sortTasks').val(), getCurrentPageNumber()); // refresh tasks
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                // Handle error here
                $("#messages").text("Error: " + error).addClass('error');
            }
        });
    });

    // Cancel update button click event
    $('#tasks-container').on('click', '.cancelUpdateButton', function () {
        const taskItem = $(this).closest('.task-item');

        // Show delete and edit buttons
        taskItem.find('.deleteButton').show();
        taskItem.find('.updateButton').show();

        // Hide update form and show regular text
        taskItem.removeClass('editing');
        taskItem.find('.task-name').show();
        taskItem.find('.task-description').show();
        taskItem.find('.task-category').show();
        taskItem.find('.task-label').show();
        taskItem.find('.task-dueDate').show();
        taskItem.find('.task-priority').show();
        taskItem.find('.task-status').show();
        taskItem.find('.updateForm').hide();
    });




    // DELETE TASK
    $('#tasks-container').on('click', '.deleteButton', function () {
        const taskId = $(this).attr('id');
        const taskItem = $(this).closest('.task-item'); // Retrieve taskItem here

        console.log(taskId);
        console.log(taskItem);

        // If not in editing mode, delete the task
        if (!taskItem.hasClass('editing')) {
            $.ajax({
                type: 'DELETE',
                url: '/tasks/' + taskId,
                success: function (response) {
                    // Remove the task item from the DOM
                    updateTasks($('#sortTasks').val(), getCurrentPageNumber());
                    console.log('Task deleted successfully');
                    $('#messages').text("Task deleted successfully!").addClass('success');
                },
                error: function (xhr, status, error) {
                    console.error('Error:', error);
                    // Handle error here
                    $("#messages").text("Error: " + error).addClass('error');
                }
            });
        } else {
            // Hide update form and show regular text
            taskItem.removeClass('editing');
            taskItem.find('.task-name').show();
            taskItem.find('.task-description').show();
            taskItem.find('.task-category').show();
            taskItem.find('.task-label').show();
            taskItem.find('.task-dueDate').show();
            taskItem.find('.task-priority').show();
            taskItem.find('.updateForm').hide();
        }
    });
});


// Pagination
$(document).ready(function () {
    // Handle pagination link click event
    $('.pagination').on('click', '.pagination-link', function (e) {
        e.preventDefault(); // Prevent default anchor tag behavior

        const page = $(this).data('page');

        const sortBy = $('#sortTasks').val(); // Get the current sorting option
        updateTasks(sortBy, page); // Fetch tasks for the clicked page
    });
});



// SORTING
$(document).ready(function () {

    // Handle sorting option change
    $('#sortTasks').change(function () {
        const sortBy = $(this).val();
        updateTasks(sortBy, 1);
    });

    // Call updateTasks initially with default sorting
    updateTasks('name', 1); // Default sorting by name

});


// REFRESH TASKS WITH SORTING AND PAGE
function updateTasks(sortBy, page) {
    $.ajax({
        type: 'GET',
        url: '/tasks',
        data: { sortBy: sortBy, page: page }, // Pass sorting parameter and page number to the server
        contentType: 'application/json',
        success: async function (result) {
            renderTasks(result.tasks, result.currentPage); // Pass both tasks and currentPage
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });
}




// REFRESH TASKS
function renderTasks(tasks, currentPage) {
    $('#tasks-container').html('');
    tasks.forEach(task => {
        const formattedDate = new Date(task.dueDate).toISOString();
        const dueDate = new Date(formattedDate).toLocaleDateString('en-CA', { timeZone: 'UTC' }); //format date
        $('#tasks-container').append(`
<div class="task-item" data-task-id="${task._id}">
    <h3 class='task-name'>${task.name}</h3>
    <p class='task-description'>Description: ${task.description}</p>
    <p class='task-category'>Category: ${task.category}</p>
    <p class='task-label'>Label: ${task.label}</p>
    <p class='task-dueDate'>Due Date: ${dueDate}</p>
    <p class='task-priority'>Priority: ${task.priority}</p>
    <p class='task-status'>Status: ${task.status}</p>
    <button id="${task._id}" class="deleteButton">Delete</button>
    <button class="updateButton" id="${task._id}">Update</button>



    <form class="updateForm" style="display: none;">
                <label for="updateName">Name:</label>
                <input type="text" id="updateName" name="updateName" value="${task.name}" required><br>
                <label for="updateDescription">Description:</label>
                <textarea id="updateDescription"
                    name="updateDescription">${task.description}</textarea><br>
                <label for="updateCategory">Category:</label>
                <input type="text" id="updateCategory" name="updateCategory"
                    value="${task.category}"><br>
                <label for="updateLabel">Label:</label>
                <input type="text" id="updateLabel" name="updateLabel" value="${task.label}"><br>
                <label for="updateDueDate">Due Date:</label>
                <input type="date" id="updateDueDate" name="updateDueDate" value="${dueDate}"><br>
                <label for="updatePriority">Priority Level: </label>
                <input type="number" id="updatePriority" name="updatePriority" min="0" max="3"
                    value="${task.priority}"><br>
                <label for="status">Status: </label>
                <select name="status" id="updateStatus">
                <option value="Not started" ${task.status === 'Not started' ? 'selected' : ''}>Not started</option>
                <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Complete" ${task.status === 'Complete' ? 'selected' : ''}>Complete</option>
                </select>
                <br><br>

                <button class="confirmUpdateButton">Confirm</button>
                <button type="button" class="cancelUpdateButton">Cancel</button>
            </form>
</div>
`);
    });

    $('.pagination').html('');
    if (currentPage > 1) {
        $('.pagination').append(`<a class='pagination-link' href="/tasks?page=${currentPage - 1}" data-page="${currentPage - 1}">Previous </a>`);
    }
    $('.pagination').append(`<span>Page ${currentPage}</span>`);
    
    if (tasks.length >= 12) {
        $('.pagination').append(`<a class='pagination-link' href="/tasks?page=${currentPage + 1}" data-page="${currentPage + 1}"> Next</a>`);
    }

}


// GET PAGE NUMBER FROM FORM -- not working
function getCurrentPageNumber() {
    // Find the link with the 'active-page' class within the pagination container
    const currentPageLink = $('.pagination-link.active-page');

    // Check if there's an active page link
    if (currentPageLink.length > 0) {
        // Retrieve the page number from the 'data-page' attribute
        const pageNumber = parseInt(currentPageLink.attr('data-page'));
        return pageNumber;
    } else {
        // If no active page link found, return a default page number (e.g., 1)
        return 1; // Or you can return null or any other default value based on your requirement
    }
}