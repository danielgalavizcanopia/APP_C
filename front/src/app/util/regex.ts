export const regex = {
    firstNameAndLastnamePattern: '([a-zA-ZZáéíóúÁÉÍÓÚ]+) ([a-zA-ZáéíóúÁÉÍÓÚ]+)',
    municipalitiesNames: '([a-zA-Z]+) ([a-zA-Z]+)',
    nombrePattern: '^[a-zA-ZáéíóúÁÉÍÓÚ]+( [a-zA-ZáéíóúÁÉÍÓÚ]+)?$',
    email: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$',
    link: '/^(https?:\/\/)(www\.)([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,6}(\.[a-z]{2,6})?(\/[-a-zA-Z0-9@:%._\+~#=]*)?$/',
    link2: '^https?://[^\\s/$.?#].[^\\s]*$',
    textarea: /^[a-zA-Z0-9\s\-.,'()!&$%*@#!?¿¡ñáéíóúÁÉÍÓÚüÜ]{1,500}$/,
    OnlyText: '^[a-zA-ZÀ-ÿ\u00f1\u00d1]+( [a-zA-ZÀ-ÿ\u00f1\u00d1]+)*$',
    textAndNumbers: /^[^\s]+(?: [^\s]+)*$/u,
    withoutMoretwoSpaces:'^(?!.* {3}).*$',
    activityName: /^(?!.* {3})[A-Za-zÁÉÍÓÚáéíóúÑñ0-9/'\\/]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ0-9/'\\/]+)*$/
}