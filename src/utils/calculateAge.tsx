export const calculateAge = (birthDate: string) => {
    const dataNascimento = new Date(birthDate);

    const dataAtual = new Date();

    const diferencaAnos = dataAtual.getFullYear() - dataNascimento.getFullYear();

    if (
        dataAtual.getMonth() < dataNascimento.getMonth() ||
        (dataAtual.getMonth() === dataNascimento.getMonth() &&
            dataAtual.getDate() < dataNascimento.getDate())
    ) {
        return diferencaAnos - 1
    } else {
        return diferencaAnos
    }
}