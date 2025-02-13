import * as v from 'valibot'

const termFormSchema = v.object({
  termName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Tên học kỳ không được để trống'),
    v.minLength(3, 'Tên học kỳ không được ít hơn 3 kí tự'),
    v.maxLength(20, 'Tên học kỳ không được quá 20 kí tự')
  ),
  abbreviatName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Tên viết tắt không được để trống'),
    v.minLength(5, 'Tên viết tắt không được ít hơn 5 kí tự'),
    v.maxLength(5, 'Tên viết tắt không được quá 5 kí tự')
  ),
  academicYear: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Năm học không được để trống'),
    v.minLength(9, 'Năm học không hợp lệ'),
    v.maxLength(9, 'Năm học không hợp lệ')
  ),
  startDate: v.pipe(v.string(), v.trim(), v.nonEmpty('Ngày bắt đầu không được để trống')),
  endDate: v.pipe(v.string(), v.trim(), v.nonEmpty('Ngày kết thúc không được để trống'))
})

export { termFormSchema }
