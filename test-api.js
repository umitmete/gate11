async function main() {
    const payload = {
        titleDe: "B-PAKET",
        tagDe: "Klassik",
        price: "€ 100",
        courseType: "DAY",
        isVisible: true,
        order: 0,
        autoTranslate: true,
        categoryId: null,
        title: "B-PAKET",
        tag: "Klassik",
        features: "[\"Test\"]",
        featuresDe: "[\"Test\"]",
        categoryIds: "[]"
    };

    const res = await fetch('http://localhost:3000/api/admin/course-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    console.log(res.status, await res.text());
}
main();
