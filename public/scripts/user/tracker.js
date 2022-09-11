document.addEventListener('DOMContentLoaded', () => {
  const socket = io('/')

  const positionOptions = {
    enableHighAccuracy: true,
    maximumAge: 0
  }

  // retrieve users coordinates evey 1 sec
  setInterval(() => {
    console.log('tick')
    // obtain clients location
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords
      console.log('Your coordinates', pos.coords)
      socket.emit('updateLocation', { lat, lng })
    }, err => {
      console.error(err)
    }, positionOptions)
  }, 1000)
})
