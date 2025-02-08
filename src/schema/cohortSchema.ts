import * as v from 'valibot'

export const schema = v.object({
  cohortId: v.pipe(
    v.undefinedable(v.string(), ''),
    v.trim(),
    v.nonEmpty('Mã niên khóa không được để trống'),
    v.minLength(3, 'Mã niên khóa phải có ít nhất 3 ký tự'),
    v.maxLength(50, 'Mã niên khóa không được vượt quá 50 ký tự')
  ),
  cohortName: v.pipe(
    v.undefinedable(v.string(), ''),
    v.trim(),
    v.nonEmpty('Tên niên khóa không được để trống'),
    v.minLength(3, 'Tên niên khóa phải có ít nhất 3 ký tự'),
    v.maxLength(50, 'Tên niên khóa không được vượt quá 50 ký tự')
  ),
  startYear: v.pipe(
    v.undefinedable(v.string(), ''),
    v.trim(),
    v.nonEmpty('Năm bắt đầu không được để trống'),
    v.minLength(4, 'Năm không hợp lệ'),
    v.maxLength(4, 'Năm không hợp lệ')
  ),
  endYear: v.pipe(
    v.undefinedable(v.string(), ''),
    v.trim(),
    v.nonEmpty('Năm kết thúc không được để trống'),
    v.minLength(4, 'Năm không hợp lệ'),
    v.maxLength(4, 'Năm không hợp lệ')
  )
})
