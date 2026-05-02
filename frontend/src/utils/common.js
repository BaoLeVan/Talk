export const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    if (year === new Date().getFullYear()) {
        return `${day} thg ${month}`;
    }
    return `${day} thg ${month}, ${year}`;
}
 
export const formatTime = (date) => {
    const time = new Date(date);
    const hour = time.getHours();
    const minute = time.getMinutes();
    return `${hour}:${minute}`;
}

export const formatTimeChat = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    // Nếu thời gian không hợp lệ hoặc ở tương lai
    if (diffInSeconds < 0) return 'Just now';

    // Các mốc thời gian tính bằng giây
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    const weeks = Math.floor(diffInSeconds / 604800);

    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (minutes < 60) {
        return `${minutes}m`;
    } else if (hours < 24) {
        return `${hours}h`;
    } else if (days < 7) {
        return `${days}d`;
    } else {
        return `${weeks}w`;
    }
}

export const acceptFilesValidator = (file) => {
    const maxSizeBytes = 26214400; // 25MB
    if (file.size > maxSizeBytes) {
        return 'Maximum file size exceeded. (25MB)'
    }

    const validPrefixes = ['image/', 'video/'];
    const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const isValidType = validPrefixes.some(prefix => file.type.startsWith(prefix)) || validTypes.includes(file.type);

    if (!isValidType) {
        return 'Files type is invalid. Only accept images, videos, pdf, doc, docx, pptx, xlsx.'
    }
    return null
}

export const TYPE_MESSAGE = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  FILE: 'FILE'
}