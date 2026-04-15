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