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
    businessModel: 'Cửa hàng đồ ăn nhanh kết hợp phục vụ tại chỗ và giao hàng trực tuyến.',
    targetCustomers: 'Học sinh, sinh viên, nhân viên văn phòng và gia đình trẻ tại khu vực đô thị.',
    productCategories: 'Burger, gà rán, mỳ Ý, khoai chiên, đồ uống, món tráng miệng và combo tiết kiệm.',
    slogan: 'BOX & BITE - Ngon nhanh, trọn vị.',
    salesChannels: 'Bán trực tiếp tại cửa hàng, đặt món qua website và các nền tảng giao đồ ăn.',
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
    'BOX & BITE hướng đến trở thành cửa hàng đồ ăn nhanh được giới trẻ tin chọn, nổi bật với sự đa dạng trong lựa chọn sốt, mức giá phù hợp và trải nghiệm đặt món tiện lợi trên nền tảng thương mại điện tử. Cửa hàng mong muốn xây dựng hình ảnh một thương hiệu trẻ trung, năng động, đáp ứng nhanh nhu cầu ăn uống hiện đại nhưng vẫn đảm bảo chất lượng.',
    'Trong dài hạn, BOX & BITE đặt mục tiêu phát triển mô hình kinh doanh đồ ăn nhanh an toàn, dễ tiếp cận và khác biệt thông qua các combo linh hoạt, giúp khách hàng vừa tiết kiệm chi phí vừa có nhiều lựa chọn phù hợp với nhu cầu cá nhân.'
  ];

  readonly mission = [
    'BOX & BITE cam kết mang đến cho khách hàng những món ăn nhanh chất lượng, giá cả hợp lý, được chế biến từ nguyên liệu đảm bảo an toàn vệ sinh thực phẩm. Cửa hàng chú trọng đa dạng hóa các loại sốt ăn kèm, tạo nên trải nghiệm ẩm thực phong phú và khác biệt so với các cửa hàng đồ ăn nhanh cùng phân khúc.',
    'Bên cạnh đó, BOX & BITE không ngừng tối ưu các combo ưu đãi, quy trình đặt hàng và giao nhận nhằm giúp khách hàng dễ dàng thưởng thức món ăn ngon, tiện lợi và tiết kiệm, đồng thời nâng cao trải nghiệm mua sắm trực tuyến.',
  ];

  readonly productOverview = {
    summary:
      'Danh mục sản phẩm của BOX & BITE tập trung vào các món ăn nhanh phổ biến, dễ tiếp cận và phù hợp khẩu vị số đông. Các combo được thiết kế linh hoạt để khách hàng dễ lựa chọn theo nhu cầu no nhanh hoặc no nê.',
    highlights: [
      'Món ăn chế biến nhanh nhưng vẫn đảm bảo hương vị và độ tươi mới.',
      'Nhiều mức giá từ món lẻ đến combo tiết kiệm cho nhóm khách hàng khác nhau.',
      'Tùy chọn topping, sốt và kích cỡ giúp cá nhân hóa trải nghiệm ăn uống.',
      'Dễ đóng gói, tiện mang đi, phù hợp nhịp sống bận rộn tại đô thị.',
    ],
  };

  readonly reasons = [
    'Phù hợp xu hướng thị trường đồ ăn nhanh và nhu cầu tiêu dùng hiện đại.',
    'Phù hợp mô hình kinh doanh nhờ tốc độ chế biến nhanh và vận hành linh hoạt.',
    'Có tiềm năng phát triển cao khi kết hợp bán tại cửa hàng và bán online.',
  ];

}
