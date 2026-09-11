export function randomColor(): string{
    let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return(color);
}

export function randomIcon(): string{
    let allIcons = [
        "bishop",
        "knight",
        "pawn",
        "rook",
        "cards",
        "diamond",
        "cannabis",
        "mask",
        "star",
        "cross",
        "rocket",
        "snow",
        "sunny",
        "tsunami",
        "wind",
        "pet",
        "owl",
        "raven",
        "snail",
        "hive"
    ]
    let randomIndex = Math.floor(Math.random() * allIcons.length);
    return(allIcons[randomIndex]);
}