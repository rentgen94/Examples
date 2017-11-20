export function defineColor(P) {
    var color;
    switch (P) {
        case 1:
            color = "red";
            break;
        case 2:
            color = "green";
            break;
        case 3:
        default:
            color = "gray";
    }
    return "cl4 " + color;
}