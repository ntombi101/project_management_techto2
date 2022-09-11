'use strict'

let map
let locationLat
let locationLng

document.addEventListener('DOMContentLoaded', () => {
  const socket = io('/')

  const positionOptions = {
    enableHighAccuracy: true,
    maximumAge: 0
  }

  // ignore the error that come up from this page, everything is defined
  window.onload = function () {
    L.mapquest.key = '4iWAiDCyYqumAEECR8IdsAibrPV8Hzv3'

    // obtain clients location
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords
      console.log('Your coordinates', pos.coords)
      socket.emit('updateLocation', { lat, lng })

      // default map layer
      map = L.mapquest.map('map', {
        center: { lat, lng },
        layers: L.mapquest.tileLayer('map'),
        zoom: 12
      })
      // add control
      map.addControl(L.mapquest.control())

      // creates marker for users location
      L.marker({ lat, lng }, {
        icon: L.mapquest.icons.marker(),
        title: 'Your Location'
      }).bindPopup('This is your Live Location').addTo(map)

      // fetch users meeting destination latitude
      fetch('/user/api/viewLatitude')
        .then(function (response) {
          // Check if the request returned a valid code
          if (response.ok) return response.json()
          else { throw new Error('Failed to load database result: response code invalid!') }
        })
        .then(function (data) {
          data.forEach(function (dbResult) {
            locationLat = dbResult.avgLatitude
          })
        })
        .catch(function (e) {
          window.alert(e)
        })
      // fetch users meeting destination longitude
      fetch('/user/api/viewLongitude')
        .then(function (response) {
          // Check if the request returned a valid code
          if (response.ok) return response.json()
          else { throw new Error('Failed to load database result: response code invalid!') }
        })
        .then(function (data) {
          data.forEach(function (dbResult2) {
            locationLng = dbResult2.avgLongitude
          })
        })
        .catch(function (e) {
          window.alert(e)
        })

      // location
      const meetingAddr = [

        [-26.15677997025098, 28.013198979503617, 'Emmarentia Public Library, Johannesburg'],
        [-26.192556260697938, 28.030537671524726, 'University of the Witwatersrand, Johannesburg'],
        [-25.767201383088207, 28.199035284339498, 'University of South Africa, Pretoria'],
        [-25.75346516785773, 28.231594662726096, 'University of Pretoria, Pretoria'],
        [-33.95616609799262, 18.46074746897121, 'University of Cape Town, Cape Town'],
        [-29.866660286589706, 30.980525342258876, 'Univerity of KwaZulu Natal, Durban '],
        [-29.105243326904624, 26.192512001347346, 'Univesrity of the Free State, Bloemfontein'],
        [-33.93308268697903, 18.62825268266075, 'University of the Western Cape, Bellvile'],
        [-33.31276389401206, 26.51664524842806, 'Rhodes University, Makhanda'],
        [-23.888505575981565, 29.738580000070126, 'University of Limpopo, Sovenga'],
        [-25.619048946779145, 28.01660271146843, 'Sefako Makgatho Health Sciences, Pretoria'],
        [-26.71024621624502, 27.86244681200673, 'Vaal University of Technology, Vanderbijlpark'],
        [-34.00071845055083, 25.671486498622002, 'Nelson Mandela University, Gqeberha'],
        [-33.931496617307126, 18.864610575109147, 'Stellenbosch University, Stellenbosch'],
        [-26.273152610219913, 27.831257727345484, 'Protea North Library, Pretoria'],
        [-26.19823396451694, 28.02792262083018, 'Johannesburg City Library, Johannesburg'],
        [-26.107490063549573, 28.055425071523725, 'Sandton Library, Sandton'],
        [-26.139374337488803, 27.990475627343613, 'Linden Library, Linden'],
        [-26.201307938098257, 28.06230347152475, 'Keleketla Library, Johannesburg'],
        [-26.159814767102873, 28.025729286868646, 'Parkview Library, Parkview'],
        [-25.697171781644684, 28.28182101859445, 'Waverely Library, Pretoria'],
        [-25.70985517703278, 28.22002292281412, 'Moot Community Library, Pretoria'],
        [-25.766140754232325, 28.23272586472452, 'Brooklyn Library, Pretoria']
      ]

      function getDestination () {
        // find address point near avg meeting location
        for (let i = 0; i < meetingAddr.length; i++) {
          const addressPoint = meetingAddr[i]
          const place = addressPoint[2]

          // your average location is close enough
          if (addressPoint[0] / locationLat >= 1.0000) {
            // add destination marker on map
            L.marker([addressPoint[0], addressPoint[1]], {
              icon: L.mapquest.icons.marker(),
              title: place
            }).bindPopup('This is your recommended meeting location').addTo(map)

            break
          }
        }
      }
      // on submit add destination
      document.getElementById('submit9').addEventListener('click', function (event) {
        event.preventDefault()
        getDestination()
      })
    }, err => {
      console.error(err)
    }, positionOptions)
  }
})
