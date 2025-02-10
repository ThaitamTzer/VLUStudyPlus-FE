import * as v from 'valibot'

const termFormSchema = v.object({
  termName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Tên học kỳ không được để trống'),
    v.minLength(3, 'Tên học kỳ không được ít hơn 3 kí tự'),
    v.maxLength(20, 'Tên học kỳ không được quá 20 kí tự')
  ),
  maxCourse: v.pipe(v.number(), v.integer(), v.minValue(1, 'Số lớp tối đa phải lớn hơn 0')),
  startDate: v.pipe(v.string(), v.trim(), v.nonEmpty('Ngày bắt đầu không được để trống')),
  endDate: v.pipe(v.string(), v.trim(), v.nonEmpty('Ngày kết thúc không được để trống'))
})

export { termFormSchema }
