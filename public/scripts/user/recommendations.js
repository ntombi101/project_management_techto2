'use strict'

fetch('/groups/api/recommendations')
  .then(function (response) {
    if (response.ok) return response.json()
    else { throw new Error('Failed to load database result: response code invalid!') }
  })
  .then(function (data) {
    let i = 0
    data.forEach(function (dbResult) {
      i++
      const divs = document.getElementById('grpdiv1')
      const divs2 = document.getElementById('grpdiv2')
      const li = document.createElement('LI')
      const button = document.createElement('button')
      const form = document.createElement('form')
      const myInput = document.createElement('input')

      myInput.name = 'group'
      myInput.value = dbResult.studyGroup
      myInput.type = 'hidden'

      form.method = 'POST'
      form.action = '/groups/api/joinRecommendedGroup'

      button.innerHTML = dbResult.studyGroup
      button.className = 'btn-link'
      button.type = 'submit'

      form.appendChild(myInput)
      form.appendChild(button)
      li.className = 'grps'
      li.appendChild(form)
      if (i <= 5) { divs.appendChild(li) } else if (i >= 6) { divs2.appendChild(li) }
    })
  })
  .catch(function (e) {
    window.alert(e)
  })
