import * as v from 'valibot'

const schema = v.object({
  studentId: v.pipe(
    v.string(),
    v.nonEmpty('Mã sinh viên không được để trống'),
    v.minLength(5, 'Mã sinh viên phải có ít nhất 5 ký tự'),
    v.maxLength(15, 'Mã sinh viên không được quá 15 ký tự')
  ),
  firstName: v.pipe(
    v.string(),
    v.nonEmpty('Tên không được để trống'),
    v.minLength(2, 'Tên phải có ít nhất 2 ký tự'),
    v.maxLength(20, 'Tên không được quá 20 ký tự')
  ),
  lastName: v.pipe(
    v.string(),
    v.nonEmpty('Họ không được để trống'),
    v.minLength(2, 'Họ phải có ít nhất 2 ký tự'),
    v.maxLength(20, 'Họ không được quá 20 ký tự')
  ),
  classId: v.pipe(
    v.string(),
    v.nonEmpty('Lớp không được để trống'),
    v.minLength(5, 'Lớp phải có ít nhất 5 ký tự'),
    v.maxLength(20, 'Lớp không được quá 20 ký tự')
  ),
  cohortName: v.pipe(
    v.string(),
    v.nonEmpty('Khóa không được để trống'),
    v.minLength(2, 'Khóa phải có ít nhất 2 ký tự'),
    v.maxLength(10, 'Khóa không được quá 10 ký tự')
  ),
  processing: v.pipe(
    v.array(
      v.object({
        statusHandling: v.pipe(
          v.string(),
          v.nonEmpty('Trạng thái xử lý không được để trống'),
          v.maxLength(255, 'Trạng thái xử lý không được quá 255 ký tự')
        ),
        termName: v.pipe(
          v.string(),
          v.nonEmpty('Tên học kỳ không được để trống'),
          v.includes('HK', 'Tên học kỳ phải bắt đầu bằng HK'),
          v.minLength(5, 'Tên học kỳ phải có ít nhất 5 ký tự'),
          v.maxLength(10, 'Tên học kỳ không được quá 10 ký tự')
        )
      })
    ),
    v.minLength(1, 'Trạng thái xử lý không được để trống')
  ),
  courseRegistration: v.pipe(
    v.array(
      v.object({
        isRegister: v.boolean(),
        note: v.pipe(v.undefinedable(v.string(), ''), v.maxLength(255, 'Ghi chú không được quá 255 ký tự')),
        termName: v.pipe(
          v.string(),
          v.includes('HK', 'Tên học kỳ phải bắt đầu bằng HK'),
          v.nonEmpty('Tên học kỳ không được để trống'),
          v.minLength(5, 'Tên học kỳ phải có ít nhất 5 ký tự'),
          v.maxLength(10, 'Tên học kỳ không được quá 10 ký tự')
        )
      })
    ),
    v.minLength(1, 'Đăng ký học phần không được để trống')
  ),
  handlingStatusByAAO: v.pipe(
    v.string(),
    v.nonEmpty('Trạng thái xử lý không được để trống'),
    v.minLength(1, 'Trạng thái xử lý phải có ít nhất 1 ký tự'),
    v.maxLength(50, 'Trạng thái xử lý không được quá 50 ký tự')
  ),
  note: v.pipe(v.nullable(v.string(), ''), v.maxLength(255, 'Ghi chú không được quá 255 ký tự')),
  DTBC: v.pipe(v.number(), v.maxValue(4, 'Điểm trung bình không được lớn hơn 4')),
  STC: v.pipe(v.number(), v.integer('Số tín chỉ phải là số nguyên')),
  DTBCTL: v.pipe(v.number(), v.maxValue(4, 'Điểm trung bình tích lũy không được lớn hơn 4')),
  STCTL: v.pipe(v.number(), v.integer('Số tín chỉ tích lũy phải là số nguyên')),
  reasonHandling: v.pipe(
    v.string(),
    v.nonEmpty('Lý do xử lý không được để trống'),
    v.minLength(1, 'Lý do xử lý phải có ít nhất 1 ký tự'),
    v.maxLength(255, 'Lý do xử lý không được quá 255 ký tự')
  ),
  yearLevel: v.pipe(v.nonNullable(v.string(), ''), v.maxLength(50, 'Không được quá 50 ký tự')),
  faculty: v.pipe(
    v.string(),
    v.nonEmpty('Khoa không được để trống'),
    v.minLength(1, 'Khoa phải có ít nhất 1 ký tự'),
    v.maxLength(50, 'Khoa không được quá 50 ký tự')
  ),
  year: v.pipe(
    v.string(),
    v.nonEmpty('Năm học không được để trống'),
    v.maxLength(20, 'Năm học không được quá 20 ký tự')
  ),
  termName: v.pipe(
    v.string(),
    v.nonEmpty('Tên học kỳ không được để trống'),
    v.includes('HK', 'Tên học kỳ phải bắt đầu bằng HK'),
    v.minLength(4, 'Tên học kỳ phải có ít nhất 3 ký tự'),
    v.maxLength(10, 'Tên học kỳ không được quá 10 ký tự')
  )
})

export { schema as addAcedemicProcessSchema }
