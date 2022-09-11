const confirmPassword = document.getElementById('cpass')

confirmPassword.onchange = change

function change (event) {
  const password = document.querySelector('input[name=password]')
  const confirm = document.querySelector('input[name=confirmPassword]')
  if (confirm.value === password.value) {
    confirm.setCustomValidity('')
  } else {
    confirm.setCustomValidity('Passwords do not match')
  }
}
