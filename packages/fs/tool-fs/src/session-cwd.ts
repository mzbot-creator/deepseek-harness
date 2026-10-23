/**
 * Resolution options for filesystem calls in the Session's current directory.
 * Non-agent calls leave directory defaults to the filesystem provider.
 * @module @deepseek-ai/dsh-tool-fs/session-cwd
 */

import type { Context } from '@deepseek-ai/cordis'
import type { ToolExecution } from '@deepseek-ai/dsh-tools'
import type {} from '@deepseek-ai/dsh-working-directory'

/**
 * Resolve the current directory and cancellation for a filesystem call.
 *
 * Also reports the calling session's id. A filesystem provider that serves more
 * than one execution world (a container per session, a remote host, a cloud
 * drive) needs this to decide WHICH world a path belongs to. `cwd` alone cannot
 * answer that: two sessions may legitimately share a working directory, and the
 * path prefix only guesses. Providers that do not need it ignore the field.
 *
 * @param ctx - context containing the working-directory service.
 * @param exec - tool execution supplying the agent and cancellation.
 * @returns filesystem resolution options for this call.
 */
export async function sessionResolveOptions(
  ctx: Context,
  exec: ToolExecution,
): Promise<{ cwd?: string; signal?: AbortSignal; sessionId?: string }> {
  const cwd = exec.agent === undefined
    ? undefined
    : await ctx.workingDirectory.ensure(exec.agent, exec.signal)
  return {
    ...cwd !== undefined ? { cwd } : {},
    signal: exec.signal,
    sessionId: exec.agent?.session.id,
  }
}
