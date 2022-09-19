'use strict'

// Function to hide the loader
function hideloader() {
    document.getElementById('loading').style.display = 'none';
}

function show (data) {

  let tab = 
        `<tr>
          <th>Project </th>
          <th>Start Date </th>
          <th>End Date </th>
          <th>Description </th>
          <th>Progress </th>
          <th>DateCreated </th>
         </tr>`;
    
    // Loop to access all rows 
    data.forEach(element => {
      tab += `<tr> 
      <td>${element.projectName + '&nbsp &nbsp &nbsp &nbsp'} </td>
      <td>${JSON.stringify(element.startDate).slice(1,11) +'&nbsp &nbsp &nbsp &nbsp'} </td>
      <td>${JSON.stringify(element.endDate).slice(1,11) + '&nbsp &nbsp &nbsp &nbsp'} </td> 
      <td>${element.description + '&nbsp &nbsp &nbsp &nbsp'} </td> 
      <td>${element.progress + '&nbsp &nbsp &nbsp &nbsp'}</td>
      <td>${JSON.stringify(element.dateCreated).slice(1,11) + '&nbsp &nbsp &nbsp &nbsp'}</td>         
      </tr>`;

    // Setting innerHTML as tab variable
    document.getElementById("projects").innerHTML = tab

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
fetch('/user/api/listProjects') // Returns a Promise for the GET request

  .then(function (response) {
    // Check if the request returned a valid code
    if (response.ok) return response.json() // Return the response parse as JSON if code is valid, →
    else { throw new Error('Failed to load database result: response code invalid!') }
  })

  .then(function (data) { // Display the JSON data appropriately
    const sampleData= data
    console.log(sampleData)

    getapi('/user/api/listProjects');
    

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
