
export default function Group(array) {
// copied and edited from https://dmitripavlutin.com/javascript-array-group/
    return  array.reduce((group, product) => {
        const { Multiple_Choice_ID } = product;
        group[Multiple_Choice_ID] = group[Multiple_Choice_ID] ?? [];
        group[Multiple_Choice_ID].push(product);
        return group;
    }, {});
}