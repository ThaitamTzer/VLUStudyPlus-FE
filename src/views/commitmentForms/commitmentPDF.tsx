'use client'
import { useMemo } from 'react'

import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import type { CommitmentForm } from '@/types/management/comimentFormType'

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
    fontFamily: 'Times_new_roman'
  },
  title: {
    fontFamily: 'Times_new_roman',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  tuyenngon: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  text: {
    fontSize: 12
  }
})

export const CommitmentFormPDF = ({ data }: { data: CommitmentForm }) => {
  const dataForm = useMemo(() => {
    return data
  }, [data])

  const getDate = (date: string | Date) => {
    const dateObj = new Date(date)
    const day = dateObj.getDate()
    const month = dateObj.getMonth() + 1
    const year = dateObj.getFullYear()

    return `${day} tháng ${month} năm ${year}`
  }

  return (
    <Document title={`Đơn cam kết học tập của ${dataForm?.name}`}>
      <Page size='A4' style={{ paddingTop: 35, paddingBottom: 65, paddingLeft: '60px', paddingRight: '60px' }}>
        <View style={styles.page}>
          <Text style={{ ...styles.title, marginBottom: '4px' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Text>
          <Text style={{ ...styles.tuyenngon, marginBottom: '4px' }}>Độc lập – Tự do – Hạnh phúc</Text>
          <Text style={{ ...styles.title, marginBottom: '4px' }}>{dataForm?.title}</Text>

          <View
            style={{
              ...styles.text,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: '2px'
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>Kính gửi:</Text>
            <View
              style={{
                paddingTop: '3px',
                gap: '3px'
              }}
            >
              <Text style={{ ...styles.text, fontWeight: 'light' }}>Ban chủ nhiệm Khoa Công nghệ Thông tin</Text>
              <Text style={{ ...styles.text, textAlign: 'center' }}>
                <Text style={{ fontWeight: 'bold' }}>Thầy/Cô CVHT:</Text>{' '}
                {dataForm?.lectureId?.userName || '.............................'}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              gap: 4
            }}
          >
            <View
              style={{
                ...styles.text,
                paddingTop: '18px',
                display: 'flex',
                flexDirection: 'row',
                gap: '20px'
              }}
            >
              <Text>
                <Text
                  style={{
                    fontWeight: 'bold'
                  }}
                >
                  Em tên:
                </Text>{' '}
                {dataForm?.name || '.............................'}{' '}
              </Text>
              <Text>
                <Text
                  style={{
                    fontWeight: 'bold'
                  }}
                >
                  Lớp:{' '}
                </Text>
                {dataForm?.classId?.classId || '.............................'}{' '}
              </Text>
              <Text>
                <Text
                  style={{
                    fontWeight: 'bold'
                  }}
                >
                  MSSV:{' '}
                </Text>
                {dataForm?.idOfStudent || '.............................'}{' '}
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                display: 'flex',
                flexDirection: 'row',
                gap: '20px'
              }}
            >
              <Text>
                <Text
                  style={{
                    fontWeight: 'bold'
                  }}
                >
                  Số điện thoại cá nhân:{' '}
                </Text>
                {dataForm?.phoneNumber || '.......................'}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Số điện thoại phụ huynh:</Text>
                {dataForm?.phoneNumberParent || '.......................'}
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                display: 'flex',
                flexDirection: 'row',
                gap: '20px'
              }}
            >
              <Text>
                <Text
                  style={{
                    fontWeight: 'bold'
                  }}
                >
                  Điểm trung bình tích lũy:{' '}
                </Text>
                {dataForm?.averageScore}
              </Text>
              <Text>
                <Text
                  style={{
                    fontWeight: 'bold'
                  }}
                >
                  Số tín chỉ tích lũy:{' '}
                </Text>
                {dataForm?.credit}
              </Text>
            </View>

            <Text style={{ fontSize: 12, fontWeight: 'bold', paddingTop: '-2px' }}>
              Thuộc diện xử lý học vụ:{' '}
              <Text
                style={{
                  fontWeight: 'light',
                  fontStyle: 'italic',
                  paddingTop: '3px'
                }}
              >
                {'{Xem file danh sách Khoa gửi ở cột '}
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontStyle: 'italic'
                  }}
                >
                  Diện XLHV (PĐT đề nghị)
                </Text>
                {'};'}
              </Text>
            </Text>
            <View
              style={{
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'row',
                gap: 12,
                flexWrap: 'wrap'
              }}
            >
              {dataForm?.processing?.map((item, index) => (
                <Text key={index}>
                  + {item.term}: {item.typeProcessing}
                </Text>
              ))}
            </View>

            <Text
              style={{
                fontSize: '12px'
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold'
                }}
              >
                Em bị xử lý học vụ lần thứ:{' '}
              </Text>
              {dataForm?.numberOfViolations}
            </Text>
            <Text
              style={{
                fontSize: '12px'
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold'
                }}
              >
                Lý do học tập sa sút:{' '}
              </Text>
              {dataForm?.reason}
            </Text>
            <Text
              style={{
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Nguyện vọng và những khó khăn:
            </Text>
            <Text
              style={{
                fontSize: '12px'
              }}
            >
              - {dataForm?.aspiration}
            </Text>
            <Text
              style={{
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Danh sách các học phần đang nợ:
            </Text>
            <View
              style={{
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                maxHeight: '200px',
                gap: '20px'
              }}
            >
              {/* Mỗi cột chứa danh sách theo chiều dọc */}
              {Array.from({ length: Math.ceil(dataForm?.debt?.length / 10) }).map((_, colIndex) => (
                <View key={colIndex} style={{ flexDirection: 'column', width: '50%' }}>
                  {dataForm?.debt?.slice(colIndex * 10, (colIndex + 1) * 10).map((item, index) => (
                    <Text key={index}>
                      + {item.term}: {item.subject}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>

          {dataForm?.commitment && (
            <View>
              <Text style={{ marginTop: 15, fontSize: '12px' }}>
                Em xin cam kết học tập và trả nợ, khắc phục khó khăn để học tập tốt hơn trong thời gian tới.
              </Text>
              <Text
                style={{
                  fontSize: '12px'
                }}
              >
                Nếu không thực hiện theo đúng cam kết, em xin chịu mọi hình thức xử lý theo quy định của nhà trường.
              </Text>
            </View>
          )}

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              fontSize: '12px'
            }}
          >
            <Text style={{ marginTop: 20 }}>TP. Hồ Chí Minh, ngày {getDate(dataForm.createdAt)}</Text>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              fontSize: '12px'
            }}
          >
            <View
              style={{
                minWidth: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >
              <Text style={{ textAlign: 'right', marginTop: 10 }}>Cố vấn học tập</Text>
              {dataForm?.insertSignatureLecturer && (
                <Image
                  src={dataForm.insertSignatureLecturer}
                  style={{
                    width: '40%'
                  }}
                />
              )}
              <Text style={{ textAlign: 'right', marginTop: `${dataForm.insertSignatureLecturer ? 10 : 50}` }}>
                {dataForm.lectureId?.userName}
              </Text>
            </View>
            <View
              style={{
                minWidth: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >
              <Text style={{ marginTop: 10 }}>Người làm đơn</Text>
              {dataForm?.insertSignatureStudent && (
                <Image
                  src={dataForm.insertSignatureStudent}
                  style={{
                    width: '40%'
                  }}
                />
              )}
              <Text style={{ marginTop: `${dataForm.insertSignatureStudent ? 10 : 50}` }}>{dataForm.name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
