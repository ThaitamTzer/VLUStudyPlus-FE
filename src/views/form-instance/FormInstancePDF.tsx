'use client'

import { useMemo } from 'react'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton } from '@mui/material'
import { Document, Font, Page, StyleSheet, Text, View, PDFDownloadLink, PDFViewer, Image } from '@react-pdf/renderer'

import type { FormInstanceType } from '@/types/management/formInstanceType'

interface FormInstancePDFProps {
  instance: FormInstanceType
  open: boolean
  onClose: () => void
  nameOfForm: string
  isStudent?: boolean
  isLecturer?: boolean
  onUpdate?: () => void
  onDelete?: () => void
  onApprove?: () => void
  onReject?: () => void
  onSign?: () => void
  isLoading?: boolean
  toogleApproveFormModalCVHT?: () => void
  toogleApproveFormModalBCNK?: () => void
}

// Đăng ký font Times New Roman
Font.register({
  family: 'Times_new_roman',
  fonts: [
    {
      src: '/fonts/Times-New-Roman.ttf'
    },
    {
      src: '/fonts/Times-New-Roman.ttf',
      fontWeight: 'light'
    },
    {
      src: '/fonts/SVN-Times New Roman 2 bold.ttf',
      fontWeight: 'bold'
    },
    {
      src: '/fonts/SVN-Times New Roman Italic.ttf',
      fontStyle: 'italic'
    },
    {
      src: '/fonts/SVN-Times New Roman 2 bold italic.ttf',
      fontStyle: 'italic',
      fontWeight: 'bold'
    }
  ]
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times_new_roman',
    paddingTop: 35,
    paddingBottom: 65,
    paddingLeft: 60,
    paddingRight: 60
  },
  title: {
    fontFamily: 'Times_new_roman',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subtitle: {
    fontFamily: 'Times_new_roman',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  header: {
    fontFamily: 'Times_new_roman',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10
  },
  text: {
    fontFamily: 'Times_new_roman',
    fontSize: 12,
    marginBottom: 3
  },
  textBold: {
    fontFamily: 'Times_new_roman',
    fontSize: 12,
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontFamily: 'Times_new_roman',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
    backgroundColor: '#f5f5f5',
    padding: 5,
    borderLeft: '4 solid #1976d2'
  },
  field: {
    marginBottom: 10,
    paddingLeft: 10
  },
  fieldLabel: {
    fontFamily: 'Times_new_roman',
    fontSize: 11,
    marginBottom: 2
  },
  fieldRequired: {
    color: 'red'
  },
  fieldInput: {
    height: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    marginTop: 2,
    marginBottom: 2
  },
  textareaInput: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    marginTop: 2,
    marginBottom: 2
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  signatureBox: {
    width: '40%'
  },
  signatureTitle: {
    fontFamily: 'Times_new_roman',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5
  },
  signaturePlaceholder: {
    fontFamily: 'Times_new_roman',
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 5
  },
  dateText: {
    fontFamily: 'Times_new_roman',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 20,
    marginRight: 20
  }
})

const FormInstance = ({ data }: { data: FormInstanceType }) => {
  // Hàm nhóm các trường theo row
  const groupFieldsByRow = (fields: any[]) => {
    const rows: Record<number, any[]> = {}

    // Nhóm các trường theo row
    fields.forEach(field => {
      if (!rows[field.row]) {
        rows[field.row] = []
      }

      rows[field.row].push(field)
    })

    // Sắp xếp các trường trong mỗi row theo column
    Object.keys(rows).forEach(rowKey => {
      rows[Number(rowKey)].sort((a, b) => a.column - b.column)
    })

    // Trả về mảng các row, mỗi row là một mảng các trường đã sắp xếp theo column
    return Object.keys(rows)
      .map(Number)
      .sort((a, b) => a - b)
      .map(rowKey => rows[rowKey])
  }

  // Lấy giá trị đã nhập của một field
  const getFieldValue = (fieldKey: string) => {
    if (!data.responses) return ''

    const value = data.responses[fieldKey]

    if (value === null || value === undefined) return ''

    return value
  }

  // Lấy giá trị đã nhập cho field signature
  const getSignatureValue = (fieldKey: string) => {
    if (!data.responses) return null

    const value = data.responses[fieldKey]

    if (!value) return null

    // Signature có thể có cấu trúc { name, image }
    if (typeof value === 'object' && value !== null) {
      return value.image || null
    }

    return value
  }

  // Lọc ra các section chứa chữ ký
  const signatureSections = data?.templateSnapshot?.sections?.filter(section =>
    section.fields.some(field => field.type === 'signature')
  )

  const getDate = (data: any) => {
    const date = new Date(data)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return `ngày ${day} tháng ${month} năm ${year}`
  }

  return (
    <Document title={data?.templateSnapshot?.title}>
      <Page size='A4' style={styles.page}>
        <>
          <Text style={styles.title}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Text>
          <Text style={styles.subtitle}>Độc lập – Tự do – Hạnh phúc</Text>

          {data?.templateSnapshot?.documentCode && (
            <View
              style={{
                border: '1px solid #000',
                padding: 5,
                display: 'flex',
                maxWidth: 150,
                margin: '5px 0'
              }}
            >
              <Text
                style={{
                  fontFamily: 'Times_new_roman',
                  fontSize: 12
                }}
              >
                {data?.templateSnapshot?.documentCode}
              </Text>
            </View>
          )}

          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0
            }}
          >
            <Text style={styles.header}>{data?.templateSnapshot?.title?.toUpperCase()}</Text>
            {data?.templateSnapshot?.description && (
              <Text
                style={{
                  fontFamily: 'Times_new_roman',
                  fontSize: 13,
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}
              >
                ({data?.templateSnapshot?.description})
              </Text>
            )}
          </View>

          {/* Người nhận */}
          <View
            style={{ marginBottom: 10, marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
          >
            <Text style={styles.textBold}>Kính gửi: </Text>
            <View style={{ display: 'flex', flexDirection: 'column' }}>
              {data?.templateSnapshot?.recipient?.map((recipient: string, index: number) => (
                <Text key={index} style={[styles.text, { fontWeight: 'bold' }]}>
                  {recipient}
                </Text>
              ))}
            </View>
          </View>

          <View style={{ margin: '10px 0' }}></View>
          {/* Các phần của đơn */}
          {data?.templateSnapshot?.sections
            ?.filter(section => !section.fields.some(field => field.type === 'signature'))
            .map((section, secIndex: number) => (
              <View key={secIndex} style={{ marginBottom: 3, display: 'flex', flexDirection: 'column' }}>
                {/* Nhóm các field theo row */}
                {groupFieldsByRow(section.fields).map((rowFields, rowIndex) => (
                  <View
                    key={rowIndex}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginBottom: 1,
                      width: '100%'
                    }}
                  >
                    {/* Hiển thị các field trong row */}
                    {rowFields.map((field, fieldIndex) => {
                      // Lấy giá trị đã nhập
                      const fieldValue = getFieldValue(field.key)

                      return (
                        <View
                          key={fieldIndex}
                          style={{
                            marginBottom: 1,
                            display: 'flex',
                            flexGrow: 1,
                            flexDirection:
                              field.type === 'textarea' ? 'column' : field.type === 'array' ? 'column' : 'row'
                          }}
                        >
                          <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text
                              style={[
                                styles.fieldLabel,
                                { flexGrow: field.type === 'textarea' ? 0 : field.type === 'array' ? 0 : 1 }
                              ]}
                            >
                              {field.type !== 'checkbox' ? field.label : ''}
                            </Text>
                            {field.type !== 'checkbox' && <Text style={[styles.fieldLabel]}>:</Text>}
                          </View>

                          {/* Hiển thị giá trị đã nhập */}

                          {field.type === 'text' && (
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize: 11,
                                fontFamily: 'Times_new_roman'
                              }}
                            >
                              {fieldValue}
                            </Text>
                          )}
                          {field.type === 'shortText' && (
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize: 11,
                                fontFamily: 'Times_new_roman'
                              }}
                            >
                              {fieldValue}
                            </Text>
                          )}
                          {field.type === 'phone' && (
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize: 11,
                                fontFamily: 'Times_new_roman'
                              }}
                            >
                              {fieldValue}
                            </Text>
                          )}
                          {field.type === 'number' && (
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize: 11,
                                fontFamily: 'Times_new_roman'
                              }}
                            >
                              {fieldValue}
                            </Text>
                          )}

                          {field.type === 'date' && (
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize: 11,
                                fontFamily: 'Times_new_roman'
                              }}
                            >
                              {fieldValue}
                            </Text>
                          )}

                          {field.type === 'checkbox' && (
                            <Text
                              style={{
                                fontSize: 11,
                                fontFamily: 'Times_new_roman'
                              }}
                            >
                              {fieldValue === true || fieldValue === 'true' ? field.label : ''}
                            </Text>
                          )}

                          {field.type === 'textarea' && (
                            <Text
                              style={{
                                marginTop: 5,
                                fontSize: 11,
                                fontFamily: 'Times_new_roman'
                              }}
                            >
                              - {fieldValue}
                            </Text>
                          )}

                          {field.type === 'array' && fieldValue && (
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '100%',
                                maxHeight: 300,
                                flexWrap: 'wrap'
                              }}
                            >
                              {(() => {
                                const items = Array.isArray(fieldValue) ? fieldValue : [fieldValue]

                                return items.map((item, i) => (
                                  <View key={i} style={{ width: '50%', paddingRight: 10 }}>
                                    <Text style={{ fontSize: 11, marginBottom: 4 }}>{item}</Text>
                                  </View>
                                ))
                              })()}
                            </View>
                          )}
                        </View>
                      )
                    })}
                  </View>
                ))}
              </View>
            ))}

          {/* Phần ngày tháng */}
          <Text style={styles.dateText}>TP. Hồ Chí Minh, {getDate(data?.createdAt)}</Text>

          {/* Phần chữ ký */}
          <View
            style={{
              display: 'flex',
              width: '100%',
              marginTop: 10
            }}
          >
            {signatureSections?.map((section, index) => (
              <View key={index} style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                {groupFieldsByRow(section.fields).map((rowFields, rowIndex) => (
                  <View
                    key={rowIndex}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginBottom: 1,
                      width: '100%'
                    }}
                  >
                    {rowFields.map((field, fieldIndex) => {
                      const signatureValue = getSignatureValue(field.key)

                      const signatureName =
                        field.type === 'signature' &&
                        typeof data.responses[field.key] === 'object' &&
                        data.responses[field.key] !== null
                          ? data.responses[field.key].name
                          : ''

                      return (
                        <View key={fieldIndex} style={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                          <Text style={styles.signatureTitle}>{field.label}</Text>
                          {signatureValue ? (
                            <>
                              <Image
                                src={signatureValue}
                                style={{
                                  width: '40%',
                                  alignSelf: 'center',
                                  maxHeight: 50,
                                  minHeight: 50
                                }}
                              />
                            </>
                          ) : (
                            <View style={{ height: 50 }}></View>
                          )}
                          <Text style={styles.signaturePlaceholder}>
                            {signatureName ? `${signatureName}` : '(Ký và ghi rõ họ tên)'}
                          </Text>
                        </View>
                      )
                    })}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </>
      </Page>
    </Document>
  )
}

export default function FormInstancePDF({
  instance,
  open,
  onClose,
  nameOfForm,
  isStudent,
  isLecturer,
  onUpdate,
  onDelete,
  onApprove,
  onReject,
  isLoading
}: FormInstancePDFProps) {
  const instanceData = useMemo(() => instance, [instance])

  return (
    <Dialog open={open} onClose={onClose} maxWidth='lg' fullWidth>
      <DialogTitle>Đơn của {nameOfForm}</DialogTitle>
      <DialogContent>
        <Box sx={{ height: '70vh', mt: 2 }}>
          {isLoading ? (
            <Skeleton variant='rectangular' width='100%' height='100%' animation='wave' />
          ) : (
            <PDFViewer width='100%' height='100%' style={{ border: 'none' }}>
              <FormInstance data={instanceData} />
            </PDFViewer>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isStudent && instanceData.approved.approveStatus === 'pending' && (
            <Button onClick={onUpdate} variant='contained' color='warning'>
              Cập nhật đơn
            </Button>
          )}
          {isStudent && instanceData.approved.approveStatus === 'pending' && (
            <Button onClick={onDelete} variant='contained' color='error'>
              Xóa đơn
            </Button>
          )}
          {isLecturer && (
            <Button onClick={onApprove} variant='contained' color='success'>
              Duyệt đơn
            </Button>
          )}
          {isLecturer && (
            <Button onClick={onReject} variant='contained' color='error'>
              Từ chối đơn
            </Button>
          )}
          <Button onClick={onClose} variant='outlined'>
            Đóng
          </Button>
          <PDFDownloadLink
            document={<FormInstance data={instanceData} />}
            fileName={`${instanceData?.templateSnapshot?.title}.pdf`}
            style={{
              textDecoration: 'none'
            }}
          >
            {({ loading }) => (
              <Button variant='contained' disabled={loading}>
                {loading ? 'Đang chuẩn bị...' : 'Tải PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
