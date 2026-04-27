# Skill: GitHub MCP Operator

## Description
Kích hoạt các thao tác Git/GitHub thông qua MCP khi người dùng yêu cầu Sync code.

## Triggers
- "Pull code", "Push code", "Sync GitHub", "Tạo PR".

## Execution Steps
1. **Identify**: Xác định các file đã thay đổi bằng `git_status` (via MCP).
2. **Summarize**: Tóm tắt nhanh thay đổi để tạo commit message chuẩn (feat/fix/docs).
3. **Sync**: 
   - Gọi MCP `git_pull` để cập nhật code mới nhất.
   - Gọi MCP `git_add` và `git_commit` với message đã tóm tắt.
   - Gọi MCP `git_push` để đẩy lên repository.
4. **Report**: Trả về link commit hoặc trạng thái thành công/thất bại.

## Constraints
- Sử dụng trực tiếp các tool từ GitHub MCP.
- Không lặp lại các bước giải thích code dài dòng trừ khi được hỏi.
- Luôn pull trước khi push để tránh lỗi out-of-sync. 
