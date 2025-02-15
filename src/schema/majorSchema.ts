import * as v from 'valibot'

export const schema = v.object({
  majorId: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Mã ngành không được để trống'),
    v.minLength(7, 'Mã ngành phải có ít nhất 7 ký tự'),
    v.maxLength(7, 'Mã ngành không được quá 7 ký tự')
  ),
  majorName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Tên ngành không được để trống'),
    v.minLength(3, 'Tên ngành phải có ít nhất 3 ký tự'),
    v.maxLength(100, 'Tên ngành không được quá 100 ký tự')
  )
})
