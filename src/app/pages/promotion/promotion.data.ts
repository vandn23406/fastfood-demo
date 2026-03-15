export type PromotionItem = {
    title: string;
    price: string;
    image: string;
    desc: string;
};

export const PROMOTION_ITEMS: PromotionItem[] = [
    {
        title: 'Ưu đãi khai trương - 30% tất cả món ăn',
        price: '30%',
        image: '/assets/images/CB001.jpeg',
        desc: 'Tất cả món ăn trong thực đơn đều được giảm giá 30% nhân dịp khai trương. Nhanh tay đặt hàng để tận hưởng ưu đãi hấp dẫn này!',
    },
    {
        title: 'Ưu đãi cơm trưa - Mua 1 tặng 1',
        price: 'Mua 1 tặng 1',
        image: '/assets/images/CB002.jpeg',
        desc: 'Vào giờ cơm trưa, khi bạn mua một phần cơm, bạn sẽ được tặng ngay một phần nước miễn phí. Đây là cơ hội tuyệt vời để thưởng thức bữa trưa ngon miệng cùng đồng nghiệp hoặc bạn bè.',
    },
];