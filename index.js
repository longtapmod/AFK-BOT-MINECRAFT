const { Client } = require('node-bedrock-protocol')

// =======================================================
// CẤU HÌNH ĐÃ ĐƯỢC THAY THẾ BẰNG THÔNG TIN CỦA BẠN
// =======================================================
const BOT_CONFIG = {
  host: 'dailongsever111.aternos.me', // <== ĐỊA CHỈ SERVER CỦA BẠN
  port: 12286, // <== CỔNG BEDROCK CỤ THỂ CỦA BẠN
  username: 'AFK_Bot_121', // Tên bot sẽ hiển thị trong game
  version: '1.21.10', // Phiên bản giao thức (phù hợp với 1.21.114)
  offline: true // Sử dụng chế độ ngoại tuyến
}

const client = new Client(BOT_CONFIG)

// -------------------------------------------------------
// LOGIC BOT (Kết nối và Lắng nghe sự kiện)
// -------------------------------------------------------

client.on('join', () => {
  console.log(`[BOT] Đã kết nối thành công vào server Bedrock!`)
  console.log(`[BOT] Tên người chơi: ${BOT_CONFIG.username}`)
  console.log(`[BOT] Đang ở chế độ AFK (đứng yên) để giữ server hoạt động.`)
})

client.on('error', (error) => {
  console.error(`[BOT LỖI] Đã xảy ra lỗi kết nối: ${error.message}`)
})

client.on('disconnect', (reason) => {
  console.log(`[BOT NGẮT KẾT NỐI] Đã ngắt kết nối: ${reason}`)
  // Thử kết nối lại sau 5 giây để duy trì AFK
  setTimeout(() => {
    console.log('[BOT] Đang thử kết nối lại...')
    client.connect()
  }, 5000)
})

// === PHẦN XỬ LÝ LỆNH CHAT TRONG GAME ===
client.on('text', (packet) => {
  const message = packet.message.toLowerCase()
  const sender = packet.source_name

  console.log(`[CHAT NHẬN]: <${sender}> ${message}`)

  // Bỏ qua tin nhắn của chính bot
  if (sender === BOT_CONFIG.username) return

  // Hàm tiện ích để gửi lệnh /say
  const sendCommand = (commandText) => {
    client.write('command_request', {
      command: commandText,
      origin: {
        type: 'player',
        uuid: '',
        request_id: '',
        player_entity_id: ''
      },
      internal: false,
      version: 58
    })
  }

  // --------------------------------------------------
  // Xử lý LỆNH 1: !hello
  // --------------------------------------------------
  if (message.startsWith('!hello')) {
    const response = `/say Chào bạn, ${sender}! Tôi là Bot AFK và đang nhận lệnh.`
    sendCommand(response)
    console.log(`[BOT GỬI]: ${response}`)
  }

  // --------------------------------------------------
  // Xử lý LỆNH 2: !status
  // --------------------------------------------------
  if (message.startsWith('!status')) {
    // client.state?.x là cách lấy vị trí an toàn, nếu không lấy được thì dùng '?'
    const x = client.state?.x.toFixed(1) || 'Không rõ'
    const y = client.state?.y.toFixed(1) || 'Không rõ'
    const z = client.state?.z.toFixed(1) || 'Không rõ'
    
    const response = `/say Tôi đang đứng yên tại tọa độ X:${x}, Y:${y}, Z:${z}.`
    sendCommand(response)
    console.log(`[BOT GỬI]: ${response}`)
  }
})
// =======================================================

client.connect()
