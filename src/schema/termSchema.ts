import * as v from 'valibot'

const termFormSchema = v.object({
  termName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Tên học kỳ không được để trống'),
    v.minLength(3, 'Tên học kỳ không được ít hơn 3 kí tự'),
    v.maxLength(20, 'Tên học kỳ không được quá 20 kí tự')
  ),
  startYear: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Năm bắt đầu không được để trống'),
    v.minLength(4, 'Năm bắt đầu không hợp lệ'),
    v.maxLength(4, 'Năm bắt đầu không hợp lệ')
  ),
  endYear: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Năm kết thúc không được để trống'),
    v.minLength(4, 'Năm kết thúc không hợp lệ'),
    v.maxLength(4, 'Năm kết thúc không hợp lệ')
  ),
  startDate: v.pipe(v.string(), v.trim(), v.nonEmpty('Ngày bắt đầu không được để trống')),
  endDate: v.pipe(v.string(), v.trim(), v.nonEmpty('Ngày kết thúc không được để trống'))
})

export { termFormSchema }
