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