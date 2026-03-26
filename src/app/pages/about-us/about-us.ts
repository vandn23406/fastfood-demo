import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  readonly introduction = {
    businessModel: 'Thương hiệu đồ ăn nhanh phục vụ đa kênh, kết hợp trải nghiệm tại cửa hàng và đặt món trực tuyến.',
    targetCustomers: 'Khách hàng bận rộn tại đô thị: nhân viên văn phòng, gia đình trẻ và nhóm bạn cần bữa ăn nhanh, tiện lợi.',
    productCategories: 'Burger, gà rán, mỳ Ý, khoai chiên, đồ uống, món tráng miệng và các combo tối ưu chi phí.',
    slogan: 'BOX & BITE - Ngon nhanh, trọn vị.',
    salesChannels: 'Phục vụ tại cửa hàng, đặt món qua website và liên kết nền tảng giao đồ ăn phổ biến.',
  };

  readonly logoInfo = {
    image: '/avatar-logo-removebg-preview.png',
    meaning:
      'Biểu tượng hộp thức ăn kết hợp miếng cắn thể hiện sự tiện lợi, nhanh gọn và đậm chất đồ ăn nhanh. Tông đỏ nâu và vàng cam gợi cảm giác ấm nóng, ngon miệng và giàu năng lượng.',
  };

  readonly brandInfo = {
    name: 'BOX & BITE',
    meaning:
      '"BOX" đại diện cho phần ăn đóng hộp tiện lợi, "BITE" là từng miếng cắn ngon miệng. Tên thương hiệu nhấn mạnh trải nghiệm thưởng thức nhanh, gọn và chất lượng.',
    pronunciation:
      'Phát âm: /boks en bai-t/. Thông điệp: Mở hộp là có bữa ngon, cắn một miếng là cảm nhận trọn vị.',
  };

  readonly vision = [
    'Trở thành thương hiệu đồ ăn nhanh được tin chọn tại TP.HCM, nổi bật bởi chất lượng ổn định, tốc độ phục vụ nhanh và trải nghiệm đặt món thuận tiện.',
    'Mở rộng hiện diện theo hướng bền vững, tập trung tối ưu sản phẩm, vận hành và dịch vụ để mỗi lần khách hàng chọn BOX & BITE đều là một lựa chọn đáng tin cậy.',
  ];

  readonly mission = [
    'Duy trì chất lượng món ăn đồng nhất thông qua nguyên liệu được chọn lọc, quy trình chế biến rõ ràng và tiêu chuẩn an toàn thực phẩm nghiêm ngặt.',
    'Không ngừng cải thiện trải nghiệm khách hàng từ đặt món, thanh toán đến giao nhận để hành trình mua hàng luôn nhanh, minh bạch và thuận tiện.',
  ];

  readonly productOverview = {
    summary:
      'Danh mục sản phẩm được xây dựng theo nhu cầu thực tế của khách hàng thành thị: dễ chọn, dễ ăn, dễ đặt. Các combo được thiết kế linh hoạt cho cá nhân, nhóm bạn và gia đình.',
    highlights: [
      'Hương vị ổn định giữa các lần mua nhờ quy trình chuẩn hóa.',
      'Danh mục giá linh hoạt từ món lẻ đến combo tối ưu ngân sách.',
      'Tùy chọn sốt, topping và khẩu phần giúp cá nhân hóa bữa ăn.',
      'Đóng gói gọn gàng, phù hợp ăn tại chỗ, mang đi hoặc giao tận nơi.',
    ],
  };

  readonly reasons = [
    'Đáp ứng đúng xu hướng tiêu dùng nhanh, tiện và rõ thông tin sản phẩm.',
    'Phù hợp vận hành đa kênh, giúp rút ngắn thời gian phục vụ khách hàng.',
    'Tạo lợi thế cạnh tranh nhờ kết hợp hiệu quả giữa cửa hàng vật lý và nền tảng trực tuyến.',
  ];

}
