# Chat Application UI Template

## Tổng quan giao diện
Thiết kế giao diện chat hiện đại theo phong cách glassmorphism + soft UI, sử dụng tone màu trắng, tím và xanh pastel.

Layout gồm 3 phần chính:

1. Sidebar trái (Navigation)
2. Danh sách cuộc trò chuyện (Conversation List)
3. Khung chat chính (Chat Window)

---

# 1. Sidebar Navigation

## Kích thước
- Width: ~300px
- Background: trắng nhạt (#F8F9FC)
- Border-right nhẹ
- Padding đều 24px

## Logo
- Text: `Talker`
- Font: Bold
- Màu gradient tím/xanh
- Có icon chat dạng rounded

## Nút tạo chat mới
- Button hình vuông bo góc lớn
- Icon edit/chat
- Background tím nhạt

## Menu Items
Danh sách menu dạng vertical:

- Tin nhắn
- Danh bạ
- Nhóm
- Thông báo
- Lưu trữ
- Cài đặt

### Style
- Height item: 52px
- Border radius: 16px
- Icon + text nằm ngang
- Hover background: #F1F3FF
- Active item:
  - Background: #EEF2FF
  - Text color: #5B67FF
  - Có badge notification màu đỏ/pink

---

# 2. Card Welcome

## Style
- Background gradient trắng -> tím nhạt
- Border radius: 28px
- Padding: 24px
- Shadow nhẹ

## Nội dung
- Ảnh minh họa icon chat 3D
- Title:
  `Chào mừng bạn!`
- Description:
  `Kết nối và trò chuyện cùng mọi người ngay bây giờ.`

## Button
- Full width
- Gradient xanh -> tím
- Border radius: 999px
- Text trắng

---

# 3. User Profile Bottom

## Layout
- Avatar bên trái
- Username + trạng thái online
- Menu icon bên phải

## Online Status
- Dot màu xanh lá
- Text: `Trực tuyến`

---

# 4. Conversation List Panel

## Kích thước
- Width: ~450px
- Background trắng
- Padding: 24px

---

## Search Bar

### Style
- Height: 52px
- Border radius: 18px
- Background: #F5F6FA
- Có icon search

### Placeholder
`Tìm kiếm`

---

## Filter Tabs

Tabs:
- Tất cả
- Chưa đọc
- Yêu thích
- Nhóm

### Active Tab
- Background tím nhạt
- Text tím
- Border radius: 999px

---

## Conversation Item

### Layout
- Avatar
- Tên người dùng
- Tin nhắn cuối
- Timestamp
- Badge unread

### Style
- Height khoảng 90px
- Border radius: 24px
- Hover background: #F8F9FF
- Active background: #F3F5FF

### Avatar
- Size: 56px
- Rounded full
- Có online indicator

### Username
- Font weight: 600
- Font size: 18px

### Last Message
- Font size: 14px
- Color: #6B7280

### Timestamp
- Font size: 13px
- Color: #94A3B8

### Unread Badge
- Background: #FF5C8A
- Text trắng
- Rounded full

---

# 5. Chat Window

## Header

### Layout
- Avatar
- Username
- Online status
- Action icons bên phải

### Action Icons
- Search
- Call
- Video
- More

### Style
- Height: 90px
- Background trắng
- Border-bottom nhẹ

---

# 6. Chat Messages Area

## Background
- Gradient trắng -> xanh pastel rất nhẹ
- Có pattern icon mờ phía sau

---

## Incoming Message

### Style
- Background trắng
- Border radius lớn
- Padding: 16px 20px
- Shadow nhẹ
- Max width: 60%

### Timestamp
- Nhỏ
- Màu xám nhạt

---

## Outgoing Message

### Style
- Gradient xanh -> tím
- Text trắng
- Border radius lớn
- Padding: 16px 20px
- Align right
- Max width: 60%

### Timestamp
- Nhỏ
- Có double check icon

---

# 7. Message Input Area

## Layout
- Emoji button
- Input field
- Attachment icon
- Image icon
- Sticker icon
- Send button

## Style
- Background trắng
- Border radius: 28px
- Padding: 16px 20px
- Shadow nhẹ

### Input
- Border none
- Font size: 16px
- Placeholder màu xám nhạt

### Send Button
- Hình tròn
- Gradient tím/xanh
- Icon send màu trắng

---

# 8. Design System

## Primary Colors

```txt
#5B67FF
#7C5CFF
#8B5CF6
#6EA8FE
```

## Background Colors

```txt
#FFFFFF
#F8F9FC
#F3F5FF
#EEF2FF
```

## Text Colors

```txt
#111827
#374151
#6B7280
#9CA3AF
```

---

# 9. Typography

## Font
- Inter
- Poppins
- SF Pro Display

## Sizes

| Element | Size |
|---|---|
| Main title | 28px |
| Username | 18px |
| Body text | 15px |
| Small text | 13px |

---

# 10. Border Radius

| Component | Radius |
|---|---|
| Card | 24px |
| Button | 999px |
| Chat bubble | 24px |
| Input | 28px |
| Avatar | 999px |

---

# 11. Shadow

```css
box-shadow: 0 10px 30px rgba(0,0,0,0.05);
```

---

# 12. Suggested Tech Stack

## Frontend
- ReactJS
- Material UI (MUI)
- Framer Motion
- React Query
- Socket.IO Client

## Backend
- Spring Boot
- WebSocket
- JWT Authentication
- MongoDB / PostgreSQL

---

# 13. Responsive Behavior

## Desktop
- 3 columns layout

## Tablet
- Collapse sidebar
- Conversation list nhỏ hơn

## Mobile
- Chỉ hiển thị 1 panel mỗi lần
- Navigation bottom
- Chat full screen

---

# 14. Animation Suggestion

## Hover
- Scale nhẹ 1.02
- Transition: 0.2s ease

## Chat bubble
- Fade + slide up

## Sidebar
- Smooth expand/collapse

---

# 15. UI Keywords

```txt
Modern Chat UI
Glassmorphism
Soft UI
Gradient UI
Minimal Messaging App
Pastel Dashboard
Modern Messenger Design
Clean Chat Application
```

