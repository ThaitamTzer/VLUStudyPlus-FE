import * as v from 'valibot'

export const schema = v.object({
  title: v.pipe(v.string(), v.trim(), v.minLength(5), v.maxLength(100)),
  phoneNumber: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Số điện thoại không được để trống'),
    v.minLength(10, 'Số điện thoại không hợp lệ'),
    v.maxLength(10, 'Số điện thoại không hợp lệ')
  ),
  phoneNumberParent: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Số điện thoại phụ huynh không được để trống'),
    v.minLength(10, 'Số điện thoại không hợp lệ'),
    v.maxLength(10, 'Số điện thoại không hợp lệ')
  ),
  averageScore: v.pipe(
    v.nonNullable(v.number(), 'Điểm trung bình tích lũy không được để trống'),
    v.maxValue(4, 'Điểm trung bình không được lớn hơn 4')
  ),
  credit: v.pipe(v.nonNullable(v.number(), 'Số tín chỉ không được để trống'), v.maxValue(200, 'Số tín chỉ quá nhiều')),
  processing: v.pipe(
    v.array(
      v.object({
        term: v.pipe(
          v.string(),
          v.nonEmpty('Học kỳ bị XLHV không được để trống'),
          v.includes('HK', 'Học kỳ bắt đầu bằng HK'),
          v.minLength(5, 'Học kỳ phải có ít nhất 5 ký tự'),
          v.maxLength(5, 'Trạng thái xử lý không được quá 5 ký tự')
        ),
        typeProcessing: v.pipe(
          v.string(),
          v.nonEmpty('Loại xử lý không được để trống'),
          v.maxLength(255, 'Loại xử lý không được quá 255 ký tự')
        )
      })
    ),
    v.minLength(1, 'Trạng thái xử lý không được để trống')
  ),
  numberOfViolations: v.pipe(
    v.nonNullable(v.number(), 'Số lần xử lý không được để trống'),
    v.maxValue(100, 'Số lần xử lý quá nhiều')
  ),
  reason: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Lý do không được để trống'),
    v.minLength(10, 'Lý do phải có ít nhất 10 ký tự'),
    v.maxLength(255, 'Lý do không được quá 255 ký tự')
  ),
  aspiration: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Nguyện vọng không được để trống'),
    v.minLength(10, 'Nguyện vọng phải có ít nhất 10 ký tự'),
    v.maxLength(255, 'Nguyện vọng không được quá 255 ký tự')
  ),
  debt: v.array(
    v.object({
      term: v.pipe(
        v.string(),
        v.nonEmpty('Học kỳ đăng ký môn học không được để trống'),
        v.includes('HK', 'Học kỳ bắt đầu bằng HK'),
        v.minLength(5, 'Học kỳ phải có ít nhất 5 ký tự'),
        v.maxLength(5, 'Trạng thái xử lý không được quá 5 ký tự')
      ),
      subjects: v.array(
        v.pipe(
          v.string(),
          v.nonEmpty('Tên môn học không được để trống'),
          v.minLength(10, 'Tên môn học phải có ít nhất 10 ký tự')
        )
      )
    })
  ),
  commitment: v.boolean()
})
