'use client'

import { useCallback, useState } from 'react'

import { Info as InfoIcon } from '@mui/icons-material'
import {
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Box,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material'

import type { CompareBeforeImportType } from '@/types/management/compareBeforImportType'

interface CompareDataProps {
  data: CompareBeforeImportType | null
  open: boolean
  onClose: () => void
  onImport: () => void
}

export default function CompareDataBeforeImport({ data, open, onClose, onImport }: CompareDataProps) {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }, [])

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xl' fullWidth>
      <DialogTitle>So sánh dữ liệu trước khi import</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Alert severity='info' icon={<InfoIcon />}>
            {data?.message}
          </Alert>

          {data && (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label='Danh mục' />
                  <Tab label='Môn học' />
                </Tabs>
              </Box>

              <Box sx={{ mt: 2 }}>
                {tabValue === 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Card>
                      <CardContent>
                        <Typography variant='h6' gutterBottom>
                          Danh mục thay đổi
                        </Typography>
                        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                          <Table stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Cấp độ</TableCell>
                                <TableCell>Mã số cũ</TableCell>
                                <TableCell>Tên cũ</TableCell>
                                <TableCell>Tên mới</TableCell>
                                <TableCell>Số tín chỉ cũ</TableCell>
                                <TableCell>Số tín chỉ mới</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {data?.changes?.map((change, index) => (
                                <TableRow key={index}>
                                  <TableCell>{change.stt}</TableCell>
                                  <TableCell>{change.level}</TableCell>
                                  <TableCell>{change.oldtitleN}</TableCell>
                                  <TableCell>{change.oldTitleV}</TableCell>
                                  <TableCell>{change.newTitleV}</TableCell>
                                  <TableCell>{change.oldCredits}</TableCell>
                                  <TableCell>{change.newCredit}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent>
                        <Typography variant='h6' gutterBottom>
                          Danh mục mới
                        </Typography>
                        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                          <Table stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Cấp độ</TableCell>
                                <TableCell>Mã số</TableCell>
                                <TableCell>Tên</TableCell>
                                <TableCell>Số tín chỉ</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {data?.newCategory?.map((category, index) => (
                                <TableRow key={index}>
                                  <TableCell>{category.titleN}</TableCell>
                                  <TableCell>{category.level}</TableCell>
                                  <TableCell>{category.titleN}</TableCell>
                                  <TableCell>{category.titleV}</TableCell>
                                  <TableCell>{category.credit}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Card>
                      <CardContent>
                        <Typography variant='h6' gutterBottom>
                          Môn học thay đổi - Dữ liệu cũ
                        </Typography>
                        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                          <Table stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Mã môn học</TableCell>
                                <TableCell>Tên môn học</TableCell>
                                <TableCell>TC</TableCell>
                                <TableCell>LT</TableCell>
                                <TableCell>TH</TableCell>
                                <TableCell>TT</TableCell>
                                <TableCell>Loại môn</TableCell>
                                <TableCell>ĐKTQ</TableCell>
                                <TableCell>ĐKH</TableCell>
                                <TableCell>Mã BM</TableCell>
                                <TableCell>BM</TableCell>
                                <TableCell>HKTH</TableCell>
                                <TableCell>Ghi chú</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {data?.changeSubjects?.map((subject, index) => (
                                <TableRow key={index}>
                                  <TableCell>{subject.stt}</TableCell>
                                  <TableCell>{subject.oldCourseCode}</TableCell>
                                  <TableCell>{subject.oldCourseName}</TableCell>
                                  <TableCell>{subject.oldCredits}</TableCell>
                                  <TableCell>{subject.oldLT}</TableCell>
                                  <TableCell>{subject.oldTH}</TableCell>
                                  <TableCell>{subject.oldTT}</TableCell>
                                  <TableCell>{subject.oldIsRequired ? 'Có' : 'Không'}</TableCell>
                                  <TableCell>{subject.oldPrerequisites}</TableCell>
                                  <TableCell>{subject.oldPreConditions}</TableCell>
                                  <TableCell>{subject.oldSubjectCode}</TableCell>
                                  <TableCell>{subject.oldInCharge}</TableCell>
                                  <TableCell>{subject.oldImplementationSemester}</TableCell>
                                  <TableCell>{subject.oldNote}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent>
                        <Typography variant='h6' gutterBottom>
                          Môn học thay đổi - Dữ liệu mới
                        </Typography>
                        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                          <Table stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Mã môn học</TableCell>
                                <TableCell>Tên môn học</TableCell>
                                <TableCell>TC</TableCell>
                                <TableCell>LT</TableCell>
                                <TableCell>TH</TableCell>
                                <TableCell>TT</TableCell>
                                <TableCell>Loại môn</TableCell>
                                <TableCell>ĐKTQ</TableCell>
                                <TableCell>ĐKH</TableCell>
                                <TableCell>Mã BM</TableCell>
                                <TableCell>BM</TableCell>
                                <TableCell>HKTH</TableCell>
                                <TableCell>Ghi chú</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {data?.changeSubjects?.map((subject, index) => (
                                <TableRow key={index}>
                                  <TableCell>{subject.stt}</TableCell>
                                  <TableCell>{subject.oldCourseCode}</TableCell>
                                  <TableCell>{subject.newCourseName}</TableCell>
                                  <TableCell>{subject.newCredits}</TableCell>
                                  <TableCell>{subject.newLT}</TableCell>
                                  <TableCell>{subject.newTH}</TableCell>
                                  <TableCell>{subject.newTT}</TableCell>
                                  <TableCell>{subject.newIsRequired ? 'Có' : 'Không'}</TableCell>
                                  <TableCell>{subject.newPrerequisites}</TableCell>
                                  <TableCell>{subject.newPreConditions}</TableCell>
                                  <TableCell>{subject.newSubjectCode}</TableCell>
                                  <TableCell>{subject.newInCharge}</TableCell>
                                  <TableCell>{subject.newImplementationSemester}</TableCell>
                                  <TableCell>{subject.newNote}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent>
                        <Typography variant='h6' gutterBottom>
                          Môn học mới
                        </Typography>
                        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                          <Table stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Mã môn học</TableCell>
                                <TableCell>Tên môn học</TableCell>
                                <TableCell>TC</TableCell>
                                <TableCell>LT</TableCell>
                                <TableCell>TH</TableCell>
                                <TableCell>TT</TableCell>
                                <TableCell>Loại môn</TableCell>
                                <TableCell>ĐKTQ</TableCell>
                                <TableCell>ĐKH</TableCell>
                                <TableCell>Mã BM</TableCell>
                                <TableCell>BM</TableCell>
                                <TableCell>HKTH</TableCell>
                                <TableCell>Ghi chú</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {data?.newSubjects?.map((subject, index) => (
                                <TableRow key={index}>
                                  <TableCell>{subject.stt}</TableCell>
                                  <TableCell>{subject.courseCode}</TableCell>
                                  <TableCell>{subject.courseName}</TableCell>
                                  <TableCell>{subject.credit}</TableCell>
                                  <TableCell>{subject.LT}</TableCell>
                                  <TableCell>{subject.TH}</TableCell>
                                  <TableCell>{subject.TT}</TableCell>
                                  <TableCell>{subject.isRequire ? 'Có' : 'Không'}</TableCell>
                                  <TableCell>{subject.prerequisites}</TableCell>
                                  <TableCell>{subject.preConditions}</TableCell>
                                  <TableCell>{subject.subjectCode}</TableCell>
                                  <TableCell>{subject.inCharge}</TableCell>
                                  <TableCell>{subject.implementationSemester}</TableCell>
                                  <TableCell>{subject.note}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='inherit'>
          Hủy
        </Button>
        <Button onClick={onImport} variant='contained' color='primary'>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  )
}
