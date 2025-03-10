'use client'
import { useMemo } from 'react'

import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import type { ComimentFormDetailType } from '@/types/management/comimentFormType'

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

export const CommitmentFormPDF = ({ data }: { data: ComimentFormDetailType }) => {
  const dataForm = useMemo(() => {
    return data.commitmentForm
  }, [data])

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
              gap: '4px'
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
                Thầy/Cô CVHT: {dataForm?.lectureId?.userName || '.............................'}
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
              <Text>Em tên: {dataForm?.name || '.............................'} </Text>
              <Text>Lớp: {dataForm?.classId?.classId || '.............................'} </Text>
              <Text>MSSV: {dataForm?.idOfStudent || '.............................'} </Text>
            </View>
            <View
              style={{
                ...styles.text,
                display: 'flex',
                flexDirection: 'row',
                gap: '20px'
              }}
            >
              <Text>Số điện thoại cá nhân: {dataForm?.phoneNumber}</Text>
              <Text>Số điện thoại phụ huynh: {dataForm?.phoneNumberParent}</Text>
            </View>
            <View
              style={{
                ...styles.text,
                display: 'flex',
                flexDirection: 'row',
                gap: '20px'
              }}
            >
              <Text>Điểm trung bình tích lũy: {dataForm?.averageScore}</Text>
              <Text>Số tín chỉ tích lũy: {dataForm?.credit}</Text>s
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
              Em bị xử lý học vụ lần thứ: {dataForm?.numberOfViolations}
            </Text>
            <Text
              style={{
                fontSize: '12px'
              }}
            >
              Lý do học tập sa sút: {dataForm?.reason}
            </Text>
            <Text
              style={{
                fontSize: '12px'
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
                fontSize: '12px'
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
              justifyContent: 'space-between',
              fontSize: '12px'
            }}
          >
            <View
              style={{
                minWidth: '50%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-end'
              }}
            >
              <Text style={{ textAlign: 'right', marginTop: 10 }}>Cố vấn học tập</Text>
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
              <Text style={{ marginTop: 20 }}>TP. Hồ Chí Minh, ngày .... tháng .... năm 2024</Text>
              <Text style={{ marginTop: 10 }}>Người làm đơn</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
