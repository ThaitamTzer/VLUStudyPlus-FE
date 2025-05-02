'use client'

import { useMemo } from 'react'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Document, Font, Page, StyleSheet, Text, View, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'

import type { FormTemplateType } from '@/types/management/formTemplateType'

interface FormTemplatePDFProps {
  template: FormTemplateType
  open: boolean
  onClose: () => void
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
    marginTop: 50,
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

const FormTemplate = ({ data }: { data: FormTemplateType }) => {
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

  // Lọc ra các section chứa chữ ký
  const signatureSections = data.sections.filter(section => section.fields.some(field => field.type === 'signature'))

  return (
    <Document title={data.title}>
      <Page size='A4' style={styles.page}>
        <>
          <Text style={styles.title}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Text>
          <Text style={styles.subtitle}>Độc lập – Tự do – Hạnh phúc</Text>

          {data.documentCode && (
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
                {data.documentCode}
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
            <Text style={styles.header}>{data.title.toUpperCase()}</Text>
            {data.description && (
              <Text
                style={{
                  fontFamily: 'Times_new_roman',
                  fontSize: 13,
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}
              >
                ({data.description})
              </Text>
            )}
          </View>

          {/* Người nhận */}
          <View
            style={{ marginBottom: 10, marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
          >
            <Text style={styles.textBold}>Kính gửi: </Text>
            <View style={{ display: 'flex', flexDirection: 'column' }}>
              {data.recipient.map((recipient: string, index: number) => (
                <Text key={index} style={[styles.text, { fontWeight: 'bold' }]}>
                  {recipient}
                </Text>
              ))}
            </View>
          </View>

          <View style={{ margin: '10px 0' }}></View>
          {/* Các phần của đơn */}
          {data.sections
            .filter(section => !section.fields.some(field => field.type === 'signature'))
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
                      // Tính toán độ rộng dựa trên số cột trong row
                      // Nếu có 1 cột, chiếm 100%, 2 cột mỗi cái 48%, 3 cột mỗi cái 31%
                      // const fieldWidth = rowFields.length === 1 ? '100%' : rowFields.length === 2 ? '80%' : '33%'

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
                              {field.label}
                            </Text>
                            {field.type !== 'checkbox' && <Text style={[styles.fieldLabel]}>:</Text>}
                          </View>

                          {field.type !== 'shortText' &&
                            field.type !== 'checkbox' &&
                            field.type !== 'textarea' &&
                            field.type !== 'array' && (
                              <View
                                style={{
                                  marginBottom: 4,
                                  marginLeft: 3,
                                  marginRight: 5,
                                  display: 'flex',
                                  flexGrow: 1,
                                  width: '10%',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  borderBottom: '1px dotted #000'
                                }}
                              ></View>
                            )}
                          {field.type === 'textarea' && (
                            <>
                              {Array.from({ length: 3 }).map((_, index) => (
                                <View
                                  key={index}
                                  style={{
                                    width: '99%',
                                    margin: '10px 0',
                                    marginRight: 10,
                                    display: 'flex',
                                    flexGrow: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderBottom: '1px dotted #000'
                                  }}
                                ></View>
                              ))}
                            </>
                          )}
                          {field.type === 'array' && (
                            <View
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                gap: 15
                              }}
                            >
                              <View style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                                {Array.from({ length: 7 }).map((_, index) => (
                                  <View
                                    key={index}
                                    style={{
                                      width: '100%',
                                      margin: '10px 0',
                                      marginRight: 10,
                                      display: 'flex',
                                      flexGrow: 1,
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      borderBottom: '1px dotted #000'
                                    }}
                                  ></View>
                                ))}
                              </View>
                              <View style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                                {Array.from({ length: 7 }).map((_, index) => (
                                  <View
                                    key={index}
                                    style={{
                                      width: '100%',
                                      margin: '10px 0',
                                      marginRight: 10,
                                      display: 'flex',
                                      flexGrow: 1,
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      borderBottom: '1px dotted #000'
                                    }}
                                  ></View>
                                ))}
                              </View>
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
          <Text style={styles.dateText}>TP. Hồ Chí Minh, ngày ......... tháng ......... năm .........</Text>

          {/* Phần chữ ký */}
          <View
            style={{
              display: 'flex',
              width: '100%',
              marginTop: 10
            }}
          >
            {signatureSections.map((section, index) => (
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
                    {rowFields.map((field, fieldIndex) => (
                      <View key={fieldIndex} style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                        <Text style={styles.signatureTitle}>{field.label}</Text>
                        <Text style={styles.signaturePlaceholder}></Text>
                      </View>
                    ))}
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

export default function FormTemplatePDF({ template, open, onClose }: FormTemplatePDFProps) {
  const templateData = useMemo(() => template, [template])

  return (
    <Dialog open={open} onClose={onClose} maxWidth='lg' fullWidth>
      <DialogTitle>Xem trước mẫu đơn</DialogTitle>
      <DialogContent>
        <Box sx={{ height: '70vh', mt: 2 }}>
          <PDFViewer width='100%' height='100%' style={{ border: 'none' }}>
            <FormTemplate data={templateData} />
          </PDFViewer>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={onClose}>Đóng</Button>
          <PDFDownloadLink
            document={<FormTemplate data={templateData} />}
            fileName={`${templateData.title}.pdf`}
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
