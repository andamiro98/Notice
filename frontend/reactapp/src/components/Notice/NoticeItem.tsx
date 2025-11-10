import { useCallback, useEffect, useState } from "react";
import "./NoticeItem.css";

export type Notice = {
  id: string;
  title: string;
  content: string;
  nickname: string;
  createdat: string; // ISO 문자열
  canEdit: boolean;
  email: string;
};

type Props = {
  notice: Notice;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string) => void;
  canEdit: boolean;
  canManageMent : boolean;

};

const fmt = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  });


export const NoticeItem = ({ notice, onDelete, onUpdate, canEdit, canManageMent }: Props) => {  
   const [isInfoOpen, setIsInfoOpen] = useState(false);

    // ESC로 닫기
    useEffect(() => {
      if (!isInfoOpen) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsInfoOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [isInfoOpen]);

  // 오버레이 클릭 닫기
  const onOverlayClick = useCallback(() => setIsInfoOpen(false), []);

  // 모달 안쪽 클릭은 닫힘 방지
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  
  
  

  return (
     <article className="notice">
      <header className="notice__header">
        <h3 className="notice__title">{notice.title}</h3>
        <div className="notice__meta">
          <span className="notice__user">@{notice.nickname}</span>
          <span className="notice__dot">·</span>
          <time className="notice__time" >
            {fmt.format(new Date(notice.createdat))}
          </time>
        </div>
      </header>

      <p className="notice__body">{notice.content}</p>
      
      <div className="notice__actions">
      {canEdit && !canManageMent && (
        <>
        <button
            type="button"
            className="btn notice__btn"
            onClick={() => onUpdate?.(notice.id)}
            aria-label="공지 수정"
            title="수정"
          >
            수정
          </button>
          <button
            type="button"
            className="btn danger notice__btn"
            onClick={() => onDelete?.(notice.id)}
            aria-label="공지 삭제"
            title="삭제"
          >
            삭제
          </button>
         
        </>
      )}
      {canManageMent &&(
        <>
        <button
            type="button"
            className="btn notice__btn"
            onClick={() => onUpdate?.(notice.id)}
            aria-label="공지 수정"
            title="수정"
          >
            수정
          </button>
          <button
            type="button"
            className="btn danger notice__btn"
            onClick={() => onDelete?.(notice.id)}
            aria-label="공지 삭제"
            title="삭제"
          >
            삭제
          </button>

          <button
            type="button"
            className="btn notice__btn"
            onClick={() => setIsInfoOpen(true)}
            aria-label="사용자 정보"
            title="사용자 정보"
          >
            Info
          </button>
        </>
      )}
      </div>

       {/* Info 모달 */}
      {isInfoOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={onOverlayClick}
        >
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`modal-title-${notice.id}`}
            onClick={stop}
          >
            <header className="modal-header">
              <h4 id={`modal-title-${notice.id}`} className="modal-title">
                사용자 정보
              </h4>
              <button
                className="modal-close"
                onClick={() => setIsInfoOpen(false)}
                aria-label="닫기"
                autoFocus
              >
                ×
              </button>
            </header>

            <div className="modal-body">
              <dl className="modal-dl">
                <div className="modal-row">
                  <dt>닉네임</dt>
                  <dd>{notice.nickname}</dd>
                </div>
                <div className="modal-row">
                  <dt>이메일</dt>
                  <dd>{notice.email}</dd>
                </div>
                <div className="modal-row">
                  <dt>작성시각</dt>
                  <dd>{fmt.format(new Date(notice.createdat))}</dd>
                </div>
              </dl>
            </div>

            <footer className="modal-footer">
              <button className="btn" onClick={() => setIsInfoOpen(false)}>
                닫기
              </button>
            </footer>
          </div>
        </div>
      )}



    </article>
  )
}



