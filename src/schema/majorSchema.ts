import * as v from 'valibot'

export const schema = v.object({
  majorId: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Mã chuyên ngành không được để trống'),
    v.minLength(3, 'Mã chuyên ngành phải có ít nhất 3 ký tự'),
    v.maxLength(50, 'Mã chuyên ngành không được quá 50 ký tự')
  ),
  majorName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Tên chuyên ngành không được để trống'),
    v.minLength(3, 'Tên chuyên ngành phải có ít nhất 3 ký tự'),
    v.maxLength(255, 'Tên chuyên ngành không được quá 255 ký tự')
  )
})
