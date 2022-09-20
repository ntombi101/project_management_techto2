'use strict'

// Function to hide the loader
function hideloader() {
    document.getElementById('loading').style.display = 'none';
}

function show (data) {

  let tab = 
        `<tr>
          <th>Task Name </th>
          <th>Project Name </th>
          <th>Assigned Employee </th>
          <th>Task Status </th>
          <th>Description </th>
          <th>Allocated Budget </th>
          <th>Task Completion Date </th>
         </tr>`;
    
    // Loop to access all rows 
    data.forEach(element => {
      tab += `<tr> 
      <td>${element.taskName + '&nbsp &nbsp &nbsp &nbsp'} </td>
      <td>${element.projectName_ID +'&nbsp &nbsp &nbsp &nbsp'} </td>
      <td>${ element.employeeNumber_ID + '&nbsp &nbsp &nbsp &nbsp'} </td> 
      <td>${element.progressStatus + '&nbsp &nbsp &nbsp &nbsp'} </td> 
      <td>${element.Description + '&nbsp &nbsp &nbsp &nbsp'}</td>
      <td>${element.providedBudget + '&nbsp &nbsp &nbsp &nbsp'}</td>
      <td>${JSON.stringify(element.completionDate).slice(1,11) + '&nbsp &nbsp &nbsp &nbsp'}</td>                
      </tr>`;

    // Setting innerHTML as tab variable
    document.getElementById("tasks").innerHTML = tab

    })
    
}


async function getapi(url) {
    
  // Storing response
  const response = await fetch(url);
  
  // Storing data in form of JSON
  var data = await response.json();
  console.log(data);
  if (response) {
      hideloader();
  }
  show(data);
}

// ignore the fetch is not defined problem (fetch is defined and it works)
fetch('/user/api/listTasks') // Returns a Promise for the GET request

  .then(function (response) {
    // Check if the request returned a valid code
    if (response.ok) return response.json() // Return the response parse as JSON if code is valid, →
    else { throw new Error('Failed to load database result: response code invalid!') }
  })

  .then(function (data) { // Display the JSON data appropriately
    const sampleData= data
    console.log(sampleData)

    getapi('/user/api/listTasks');
    

  })

  .catch(function (e) { // Process error for request
    window.alert(e) // Displays a browser alert with the error message.
    // This will be the string thrown in line 7 IF the
    // response code is the reason for jumping to this
    // catch() function.
  })


  .catch(function (e) {
    window.alert(e)
  })
