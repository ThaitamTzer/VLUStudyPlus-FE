import * as v from 'valibot'

export const schema = v.object({
  userId: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Mã sinh viên không được để trống'),
    v.minLength(10, 'Mã sinh viên phải có ít nhất 10 ký tự'),
    v.maxLength(13, 'Mã sinh viên không được quá 13 ký tự')
  ),
  userName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Tên sinh viên không được để trống'),
    v.minLength(3, 'Tên sinh viên phải có ít nhất 3 ký tự'),
    v.maxLength(100, 'Tên sinh viên không được quá 100 ký tự')
  ),
  classCode: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Mã lớp không được để trống'),
    v.minLength(3, 'Mã lớp phải có ít nhất 3 ký tự'),
    v.maxLength(11, 'Mã lớp không được quá 11 ký tự')
  ),
  academicYear: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Năm học không được để trống'),
    v.minLength(9, 'Năm học phải có ít nhất 9 ký tự'),
    v.maxLength(9, 'Năm học không được quá 9 ký tự')
  ),
  mail: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Email không được để trống'),
    v.includes('@vanlanguni.vn', 'Email phải chứa @vanlanguni.vn')
  )
})
