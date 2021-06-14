export default function openLink(url: string) {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = url;
    link.click();
}
