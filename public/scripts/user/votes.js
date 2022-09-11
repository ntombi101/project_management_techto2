'use strict'

const form = document.getElementById('vote-form')

form.addEventListener('submit', (e) => {
  const choice = document.querySelector('input[name=vote]:checked').value
  const data = { vote: choice }

  fetch('/groups/api/vote', {
    method: 'post',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))

  e.preventDefault()
})

fetch('/groups/api/vote') // Returns a Promise for the GET request
  .then(function (response) {
    // Check if the request returned a valid code
    if (response.ok) return response.json() // Return the response parse as JSON if code is valid, →
    else { throw new Error('Failed to load database result: response code invalid!') }
  })
  .then(data => {
    const votes = data
    console.log(data)
    const votesFound = data.filter(found => ((found.acceptMember === 'Yes') || (found.acceptMember === 'No')))
    const totalVotes = votesFound.length
    console.log(totalVotes)
    let voteCounts = {
      Yes: 0,
      No: 0
    }

    voteCounts = votes.reduce(
      (acc, vote) => (
        (acc[vote.acceptMember] = (acc[vote.acceptMember] || 0) + 1)
        , acc
      ),
      {}
    )
    console.log(voteCounts.Yes)
    let dataPoints = [
      { label: 'Yes', y: voteCounts.Yes },
      { label: 'No', y: voteCounts.No }
    ]
    const chartContainer = document.querySelector('#chartContainer')

    if (chartContainer) {
      const chart = new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        theme: 'theme1',
        title: {
          text: `total votes = ${totalVotes}`
        },
        data: [
          {
            type: 'column',
            dataPoints: dataPoints
          }
        ]
      })
      chart.render()
      // Enable pusher logging - don't include this in production
      Pusher.logToConsole = true

      const pusher = new Pusher('2763653032c734525975', {
        cluster: 'ap2'
      })

      const channel = pusher.subscribe('studycoordinator')
      channel.bind('member-vote', function (data) {
        dataPoints = dataPoints.map(x => {
          if (x.label === data.vote) {
            x.y += data.points
            return x
          } else {
            return x
          }
        })
        chart.render()
      })
    }
  })
  .catch(function (e) { // Process error for request
    window.alert(e) // Displays a browser alert with the error message.
    // This will be the string thrown in line 7 IF the
    // response code is the reason for jumping to this
    // catch() function.
  })
