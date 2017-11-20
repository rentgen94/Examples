export function filterData(data, condition) {
    if (condition === "-1") {
        return true;
    } else {
        var dataArr = data.split(".");
        var condArr = condition.split(".");
        if (dataArr[2] === condArr[1] && dataArr[1] === condArr[0]) {
            return true;
        }
    }
    return false;
}

export function filterStatus(status, condition) {
    switch (condition) {
        case "-1":
            return true;
        case "open":
            if (status === "Открыто") {
                return true;
            }
            break;
        case "complete":
            if (status === "Выполненно") {
                return true;
            }
            break;
        default:
            break;
    }
    return false;
}


export function filterSearch(name, condition) {
    if (name.includes(condition)) {
        return true;
    }
    return false;
}
