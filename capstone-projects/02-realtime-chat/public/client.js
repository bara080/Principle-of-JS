const log = document.querySelector('#log')
const nameInput = document.querySelector('#name')
const roomInput = document.querySelector('#room')
const textInput = document.querySelector('#text')

let ws
let room = ''

function line(cls, name, text) {
  const div = document.createElement('div')
  div.className = `msg ${cls}`
  const n = document.createElement('span'); n.className = 'name'; n.textContent = name
  const t = document.createElement('span'); t.textContent = text
  div.append(n, t)
  log.append(div)
  log.scrollTop = log.scrollHeight
}

document.querySelector('#connect').addEventListener('click', () => {
  ws?.close()
  ws = new WebSocket(`ws://${location.hostname}:4000`)
  ws.addEventListener('open', () => {
    ws.send(JSON.stringify({ type: 'hello', name: nameInput.value }))
    room = roomInput.value
    ws.send(JSON.stringify({ type: 'join', room }))
    line('system', 'sys', `connected as ${nameInput.value}`)
  })
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data)
    switch (msg.type) {
      case 'welcome': line('system', 'sys', `welcome (id ${msg.userId.slice(0, 6)})`); break
      case 'msg':     line('msg', msg.name, msg.text); break
      case 'roster':  line('system', 'sys', `roster (${msg.users.length}): ${msg.users.map((u) => u.name).join(', ')}`); break
      case 'history': for (const m of msg.messages) line('msg', m.name, m.text); break
      case 'error':   line('error', 'sys', `[${msg.code}] ${msg.message}`); break
    }
  })
  ws.addEventListener('close', () => line('system', 'sys', 'disconnected'))
})

document.querySelector('#send').addEventListener('submit', (e) => {
  e.preventDefault()
  if (!ws || ws.readyState !== WebSocket.OPEN) return
  ws.send(JSON.stringify({ type: 'msg', room, text: textInput.value }))
  textInput.value = ''
})
